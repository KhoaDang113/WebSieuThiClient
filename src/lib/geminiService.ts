import { GoogleGenAI } from "@google/genai";
import type { Ingredient } from "@/types/menu.type";
import { sampleProducts } from "@/pages/products/productData";
import type { Product } from "@/types";

// Khởi tạo Gemini AI
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_API_GEMINI,
});

/**
 * Lấy tất cả sản phẩm có sẵn trong kho từ productData
 */ 
function getAllAvailableProducts(): Product[] {
  const allProducts: Product[] = [];

  // Lặp qua tất cả các category và lấy products
  Object.values(sampleProducts).forEach((products) => {
    allProducts.push(...products);
  });

  return allProducts.filter((p) => p.stock_quantity > 0);
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
    const availableProducts = getAllAvailableProducts();

    // Tạo danh sách sản phẩm có sẵn để gửi cho Gemini
    const productList = availableProducts
      .map(
        (p) => `- ${p.name} (${p.quantity || "N/A"}) - Giá: ${p.final_price}đ`
      )
      .join("\n");

    const model = "gemini-2.0-flash-exp";

    const prompt = `
Bạn là một trợ lý ẩm thực chuyên nghiệp. Hãy phân tích món ăn "${dishName}" và trả về danh sách nguyên liệu cần thiết.

QUAN TRỌNG: Bạn CHỈ ĐƯỢC chọn nguyên liệu từ danh sách sản phẩm CÓ SẴN dưới đây. KHÔNG ĐƯỢC tự ý thêm nguyên liệu không có trong danh sách.

DANH SÁCH SẢN PHẨM CÓ SẴN:
${productList}

YÊU CẦU:
1. Phân tích món "${dishName}" và liệt kê các nguyên liệu cần thiết
2. CHỈ chọn nguyên liệu từ danh sách trên
3. Nếu không tìm thấy nguyên liệu chính xác, hãy chọn nguyên liệu tương tự nhất
4. Gợi ý số lượng phù hợp cho 2-3 người ăn

Trả về theo định dạng JSON như sau (KHÔNG thêm markdown hay ký tự đặc biệt):
[
  {
    "name": "Tên sản phẩm từ danh sách",
    "quantity": "Số lượng gợi ý",
    "note": "Ghi chú ngắn gọn"
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
          quantity: suggestion.quantity || matchedProduct.quantity || "1",
          unit: matchedProduct.quantity || "",
          price: matchedProduct.final_price,
          image_url: matchedProduct.image_url,
          available: true,
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
