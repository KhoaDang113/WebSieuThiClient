import { GoogleGenAI } from "@google/genai";
import type { Ingredient, MenuCombo } from "@/types/menu.type";
import type { Product } from "@/types";
import productService from "@/api/services/productService";
import categoryService from "@/api/services/catalogService";
import comboService from "@/api/services/comboService";

// Khởi tạo Gemini AI
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_API_GEMINI,
});

/**
 * Lấy tất cả sản phẩm có sẵn trong kho từ database
 */
async function getAllAvailableProducts(): Promise<Product[]> {
  try {
    // Lấy danh sách tất cả categories
    const categories = await categoryService.getRootCategories();
    const allProducts: Product[] = [];

    // Lấy sản phẩm từ từng category
    for (const category of categories) {
      try {
        const products = await productService.getProducts(category.slug);
        allProducts.push(...products);
      } catch (error) {
        console.error(
          `Error fetching products for category ${category.slug}:`,
          error
        );
      }
    }

    // Lọc sản phẩm còn hàng và active
    return allProducts.filter(
      (p) =>
        p.is_active !== false &&
        p.stock_status === "in_stock" &&
        ((p.stock_quantity && p.stock_quantity > 0) || p.quantity > 0)
    );
  } catch (error) {
    console.error("Error fetching all available products:", error);
    return [];
  }
}

/**
 * Gọi Gemini API để lấy danh sách nguyên liệu cho món ăn
 * @param dishName - Tên món ăn
 * @returns Promise<Ingredient[]> - Danh sách nguyên liệu
 */
export async function getIngredientsForDish(
  dishName: string
): Promise<Ingredient[]> {
  try {
    const availableProducts = await getAllAvailableProducts();

    // Tạo danh sách sản phẩm có sẵn để gửi cho Gemini
    const productList = availableProducts
      .map(
        (p) =>
          `- ${p.name} (${p.unit || p.quantity || "N/A"}) - Giá: ${
            p.final_price || p.unit_price
          }đ`
      )
      .join("\n");

    const model = "gemini-2.0-flash";

    const prompt = `
Bạn là một đầu bếp chuyên nghiệp Việt Nam. Hãy phân tích món ăn "${dishName}" và liệt kê CHÍNH XÁC các nguyên liệu CHÍNH cần thiết để nấu món này.

DANH SÁCH NGUYÊN LIỆU CÓ SẴN TRONG KHO:
${productList}

YÊU CẦU BẮT BUỘC:
1. CHỈ chọn nguyên liệu TỪ DANH SÁCH TRÊN - TUYỆT ĐỐI KHÔNG tự ý thêm nguyên liệu không có
2. Chọn CHÍNH XÁC tên sản phẩm giống trong danh sách (không thêm bớt chữ)
3. Chỉ chọn nguyên liệu CHÍNH của món (thịt, rau, cá, trứng...), KHÔNG chọn gia vị nhỏ
4. Gợi ý số lượng hợp lý cho 2-3 người ăn (ví dụ: 500g, 1 gói, 2 quả...)
5. Tối đa 5-7 nguyên liệu CHÍNH, không liệt kê quá nhiều

VÍ DỤ:
- Món "Thịt kho tàu" → chọn: thịt ba chỉ, trứng, nước mắm (KHÔNG chọn đường, tiêu...)
- Món "Canh chua cá" → chọn: cá, cà chua, dứa, rau ngổ (KHÔNG chọn muối, mắm...)
- Món "Gà xào sả ớt" → chọn: thịt gà, ớt, sả, hành (KHÔNG chọn dầu ăn, nước mắm...)

Trả về CHÍNH XÁC định dạng JSON (KHÔNG thêm \`\`\`json hay ký tự đặc biệt):
[
  {
    "name": "Tên chính xác của sản phẩm trong danh sách",
    "quantity": "Số lượng cụ thể",
    "note": "Ghi chú ngắn"
  }
]
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
    });

    // Lấy text từ response
    let responseText = "";
    if (response.text) {
      responseText = response.text;
    }

    // Parse JSON từ response
    // Loại bỏ markdown code blocks nếu có
    let jsonText = responseText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "").replace(/```\n?$/g, "");
    }

    const suggestedIngredients = JSON.parse(jsonText);

    // Map với sản phẩm thực tế trong kho
    const ingredients: Ingredient[] = [];
    let ingredientId = 1;

    for (const suggestion of suggestedIngredients) {
      // Tìm sản phẩm khớp tên
      const matchedProduct = availableProducts.find(
        (p) =>
          p.name.toLowerCase().includes(suggestion.name.toLowerCase()) ||
          suggestion.name.toLowerCase().includes(p.name.toLowerCase())
      );

      if (matchedProduct) {
        ingredients.push({
          id: ingredientId++,
          name: matchedProduct.name,
          quantity:
            suggestion.quantity ||
            matchedProduct.unit ||
            matchedProduct.quantity ||
            "1",
          unit: matchedProduct.unit || "",
          price: matchedProduct.final_price || matchedProduct.unit_price,
          image_url: 
            (Array.isArray(matchedProduct.image_url) 
              ? matchedProduct.image_url[0] 
              : matchedProduct.image_url) || 
            (Array.isArray(matchedProduct.image_primary) 
              ? matchedProduct.image_primary[0] 
              : matchedProduct.image_primary) || 
            "",
          available: true,
          product_id: matchedProduct._id || matchedProduct.id,
          discount_percent: matchedProduct.discount_percent || 0,
          unit_price: matchedProduct.unit_price,
          stock_quantity:
            matchedProduct.stock_quantity || matchedProduct.quantity,
        });
      }
    }

    return ingredients;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(
      "Không thể lấy danh sách nguyên liệu. Vui lòng thử lại sau."
    );
  }
}

/**
 * Gọi Gemini API để lấy danh sách gia vị phù hợp cho món ăn
 * @param dishName - Tên món ăn
 * @returns Promise<Product[]> - Danh sách gia vị với phân loại type
 */
export async function getSpicesForDish(
  dishName: string
): Promise<(Product & { spice_type?: string })[]> {
  try {
    // Lấy sản phẩm từ category gia vị
    const spiceProducts = await productService.getProducts(
      "dau-an-nuoc-cham-gia-vi"
    );

    if (!spiceProducts || spiceProducts.length === 0) {
      console.warn("No spice products found in database");
      return [];
    }

    // Tạo danh sách gia vị có sẵn
    const spiceList = spiceProducts
      .filter((p) => p.is_active !== false && p.stock_status === "in_stock")
      .map(
        (p) =>
          `- ${p.name} (${p.unit || "N/A"}) - Giá: ${
            p.final_price || p.unit_price
          }đ`
      )
      .join("\n");

    const model = "gemini-2.0-flash";

    const prompt = `
Bạn là một đầu bếp chuyên nghiệp Việt Nam. Hãy liệt kê CHÍNH XÁC các gia vị THIẾT YẾU để nấu món "${dishName}".

DANH SÁCH GIA VỊ CÓ SẴN TRONG KHO:
${spiceList}

YÊU CẦU BẮT BUỘC:
1. CHỈ chọn gia vị TỪ DANH SÁCH TRÊN - KHÔNG tự ý thêm gia vị không có
2. Chọn các gia vị THIẾT YẾU cho món này (tối đa 8-10 loại)
3. KHÔNG chọn nguyên liệu chính (thịt, cá, rau...) - CHỈ chọn GIA VỊ
4. Phân loại rõ ràng theo type:
   - "oil": Dầu ăn (dầu hướng dương, dầu oliu, dầu mè...)
   - "sauce": Nước chấm/tương (nước mắm, tương ớt, nước tương...)
   - "dry_spice": Gia vị khô (muối, tiêu, hạt nêm, bột canh...)
   - "other": Các loại khác
5. Tên gia vị phải CHÍNH XÁC giống trong danh sách

VÍ DỤ:
- Món "Thịt kho tàu" → chọn: nước mắm (sauce), đường (dry_spice), tiêu (dry_spice)
- Món "Gà xào sả ớt" → chọn: dầu ăn (oil), nước mắm (sauce), hạt nêm (dry_spice)

Trả về CHÍNH XÁC định dạng JSON (KHÔNG thêm \`\`\`json hay ký tự đặc biệt):
[
  {
    "name": "Tên chính xác của gia vị trong danh sách",
    "type": "oil|sauce|dry_spice|other",
    "note": "Mục đích sử dụng ngắn gọn"
  }
]
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
    });

    // Lấy text từ response
    let responseText = "";
    if (response.text) {
      responseText = response.text;
    }

    // Parse JSON từ response
    let jsonText = responseText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "").replace(/```\n?$/g, "");
    }

    const suggestedSpices = JSON.parse(jsonText);

    // Map với sản phẩm thực tế trong kho
    const spices: (Product & { spice_type?: string })[] = [];

    for (const suggestion of suggestedSpices) {
      // Tìm sản phẩm khớp tên
      const matchedProduct = spiceProducts.find(
        (p) =>
          p.name.toLowerCase().includes(suggestion.name.toLowerCase()) ||
          suggestion.name.toLowerCase().includes(p.name.toLowerCase())
      );

      if (matchedProduct) {
        spices.push({
          ...matchedProduct,
          spice_type: suggestion.type || "other",
        });
      }
    }

    console.log(`✅ Found ${spices.length} spices for "${dishName}"`);
    return spices;
  } catch (error) {
    console.error("Error calling Gemini API for spices:", error);
    // Không throw error, chỉ return empty array
    return [];
  }
}

/**
 * Kiểm tra xem sản phẩm có phải là nguyên liệu nấu ăn (thịt, trứng, cá, rau củ) hay không
 * @param productName - Tên sản phẩm
 * @returns boolean - true nếu là nguyên liệu nấu ăn, false nếu không
 */
export function isCookingIngredient(productName: string): boolean {
  const lowerName = productName.toLowerCase().trim();

  // Danh sách từ khóa của nguyên liệu nấu ăn
  const cookingKeywords = [
    // Thịt
    "thịt",
    "ba chỉ",
    "ba rọi",
    "sườn",
    "nạc",
    "vai",
    "đùi",
    "gà",
    "vịt",
    "bò",
    "heo",
    "lợn",
    "dê",
    "cừu",
    "ngan",
    "chim",
    "ức gà",
    "cánh gà",
    "móng giò",
    "giò heo",
    "thăn",
    "xương",
    "gân",
    "sụn",

    // Cá và hải sản
    "cá",
    "tôm",
    "mực",
    "bạch tuộc",
    "nghêu",
    "sò",
    "hào",
    "cua",
    "ghẹ",
    "ốc",
    "hến",
    "ngao",

    // Trứng
    "trứng",

    // Rau củ
    "rau",
    "cải",
    "xà lách",
    "cải thảo",
    "bắp cải",
    "su hào",
    "củ",
    "khoai",
    "cà rót",
    "cà chua",
    "cà tím",
    "ớt",
    "hành",
    "tỏi",
    "gừng",
    "sả",
    "củ cải",
    "cà rốt",
    "bí",
    "bầu",
    "mướp",
    "đậu",
    "măng",
    "nấm",
    "súp lơ",
    "súp lơ xanh",
    "bông cải",
    "cần",
    "rau muống",
    "rau dền",
    "mồng tơi",
    "ngọn bí",
    "lá",
    "rau má",
    "rau răm",
    "húng",
    "ngò",
    "mùi",
    "kinh giới",
    "tía tô",
  ];

  // Danh sách từ khóa KHÔNG phải nguyên liệu nấu ăn (để loại trừ)
  const nonCookingKeywords = [
    // Hoa quả
    "táo",
    "chuối",
    "cam",
    "quýt",
    "bưởi",
    "xoài",
    "dưa",
    "dừa",
    "ổi",
    "mít",
    "sầu riêng",
    "chôm chôm",
    "nhãn",
    "vải",
    "thanh long",
    "măng cụt",
    "mận",
    "lê",
    "nho",
    "dâu",
    "kiwi",
    "bơ",

    // Gia vị đóng gói / sẵn
    "nước mắm",
    "tương",
    "dầu ăn",
    "nước tương",
    "mì chính",
    "bột",
    "hạt nêm",
    "dầu",
    "giấm",
    "đường",
    "muối",
    "tiêu",

    // Đồ uống
    "nước",
    "coca",
    "pepsi",
    "sting",
    "trà",
    "cà phê",
    "sữa",
    "yogurt",
    "bia",
    "rượu",

    // Đồ ăn vặt / Snack
    "kẹo",
    "bánh",
    "snack",
    "mứt",
  ];

  // Kiểm tra có từ khóa KHÔNG phải nguyên liệu nấu ăn
  const hasNonCookingKeyword = nonCookingKeywords.some((keyword) =>
    lowerName.includes(keyword)
  );
  if (hasNonCookingKeyword) {
    return false;
  }

  // Kiểm tra có từ khóa nguyên liệu nấu ăn
  const hasCookingKeyword = cookingKeywords.some((keyword) =>
    lowerName.includes(keyword)
  );

  return hasCookingKeyword;
}

/**
 * Gọi Gemini API để lấy danh sách món ăn gợi ý dựa trên tên sản phẩm
 * @param productName - Tên sản phẩm (ví dụ: "Thịt ba chỉ", "Ức gà", "Cánh gà")
 * @returns Promise<MenuCombo[]> - Danh sách món ăn gợi ý từ database
 */
export async function getSuggestedDishesForProduct(
  productName: string
): Promise<MenuCombo[]> {
  try {
    // Kiểm tra xem sản phẩm có phải là nguyên liệu nấu ăn không
    if (!isCookingIngredient(productName)) {
      console.log(
        `⚠️ "${productName}" không phải là nguyên liệu nấu ăn, không gợi ý món ăn`
      );
      return [];
    }

    console.log(`✅ "${productName}" là nguyên liệu nấu ăn, đang gợi ý món...`);

    // Lấy tất cả combos từ database
    const allCombos = await comboService.getCombos();

    if (!allCombos || allCombos.length === 0) {
      console.warn("No combos found in database");
      return [];
    }

    // Tạo danh sách tên món ăn có trong database
    const comboNames = allCombos.map((c) => c.name).join("\n");

    const model = "gemini-2.0-flash";

    const prompt = `
Bạn là một đầu bếp chuyên nghiệp Việt Nam với nhiều năm kinh nghiệm. Hãy gợi ý các món ăn Việt Nam phù hợp nhất có thể nấu với nguyên liệu "${productName}".

DANH SÁCH MÓN ĂN CÓ SẴN TRONG HỆ THỐNG:
${comboNames}

YÊU CẦU BẮT BUỘC:
1. CHỈ chọn món ăn TỪ DANH SÁCH TRÊN - KHÔNG ĐƯỢC tự ý thêm món không có trong danh sách
2. Chọn TẤT CẢ món ăn PHÙ HỢP với nguyên liệu "${productName}"
3. Ưu tiên những món mà "${productName}" là nguyên liệu CHÍNH hoặc QUAN TRỌNG
4. Chọn những món ăn PHỔ BIẾN và DỄ NẤU
5. Đảm bảo tên món CHÍNH XÁC giống trong danh sách (không thêm bớt chữ)

LƯU Ý: 
- Nếu "${productName}" là thịt → chọn món có thịt làm chính
- Nếu "${productName}" là rau → chọn món xào rau, canh rau
- Nếu "${productName}" là cá/hải sản → chọn món cá, hải sản
- Nếu "${productName}" là trứng → chọn món có trứng

Trả về CHÍNH XÁC định dạng JSON sau (KHÔNG thêm markdown \`\`\`json hay ký tự đặc biệt):
[
  "Tên món ăn 1",
  "Tên món ăn 2",
  "Tên món ăn 3"
]
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
    });

    // Lấy text từ response
    let responseText = "";
    if (response.text) {
      responseText = response.text;
    }

    // Parse JSON từ response
    // Loại bỏ markdown code blocks nếu có
    let jsonText = responseText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "").replace(/```\n?$/g, "");
    }

    const suggestedDishNames: string[] = JSON.parse(jsonText);
    console.log(" AI suggested dishes:", suggestedDishNames);

    // Tìm combo khớp với tên món ăn gợi ý
    const suggestedCombos: MenuCombo[] = [];

    for (const dishName of suggestedDishNames) {
      const matchedCombo = allCombos.find(
        (combo) =>
          combo.name.toLowerCase().trim() === dishName.toLowerCase().trim() ||
          combo.name.toLowerCase().includes(dishName.toLowerCase()) ||
          dishName.toLowerCase().includes(combo.name.toLowerCase())
      );

      if (
        matchedCombo &&
        !suggestedCombos.find((c) => c._id === matchedCombo._id)
      ) {
        suggestedCombos.push(matchedCombo);
      }
    }

    console.log(" Matched combos from database:", suggestedCombos.length);
    return suggestedCombos; // Trả về tất cả món ăn phù hợp
  } catch (error) {
    console.error("Error calling Gemini API for dish suggestions:", error);
    // Không throw error, chỉ return empty array để không làm gián đoạn UX
    return [];
  }
}
