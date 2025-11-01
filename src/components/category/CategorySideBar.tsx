"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import type { CategorySideBar as Category } from "@/types/category.type";

const categories: Category[] = [
  {
    name: "KHUYẾN MÃI SỐC",
    href: "/khuyen-mai",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
  },
  {
    name: "THỊT, CÁ, TRỨNG, HẢI SẢN",
    href: "/thit-ca-trung",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Thịt heo", href: "thit-heo", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Thịt bò", href: "thit-bo", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Thịt gà, vịt", href: "thit-gia-cam", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nội tạng, xương", href: "noi-tang-xuong", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Cá tươi", href: "ca-tuoi", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Hải sản tươi/đông lạnh", href: "hai-san", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Trứng gà/vịt/cút", href: "trung", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Thịt/đồ ướp sẵn", href: "do-uop-san", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Xúc xích, chả giò", href: "xuc-xich-cha-gio", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
    ],
  },

  // 2
  {
    name: "RAU, CỦ, NẤM, TRÁI CÂY",
    href: "/rau-cu-nam-trai-cay",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Rau lá", href: "rau-la", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Củ, quả", href: "cu-qua", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nấm các loại", href: "nam", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Rau gia vị", href: "rau-gia-vi", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Trái cây tươi", href: "trai-cay", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Trái cây cắt sẵn",
        href: "trai-cay-cat-san",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      { name: "Rau củ sơ chế", href: "so-che", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Salad & mix", href: "salad", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
    ],
  },

  // 3
  {
    name: "DẦU ĂN, NƯỚC CHẤM, GIA VỊ",
    href: "/dau-an-nuoc-cham-gia-vi",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Dầu ăn", href: "dau-an", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nước mắm", href: "nuoc-mam", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nước tương", href: "nuoc-tuong", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Dầu hào, xì dầu",
        href: "dau-hao-xi-dau",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      {
        name: "Mayonnaise, sốt chấm",
        href: "mayonnaise-sot",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      { name: "Tương ớt, tương cà", href: "tuong", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Giấm, sa tế", href: "giam-sa-te", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Muối, đường", href: "muoi-duong", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Bột ngọt, hạt nêm",
        href: "bot-ngot-hat-nem",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      {
        name: "Bột canh, tiêu, ngũ vị",
        href: "bot-canh-tieu",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      { name: "Bột chiên giòn/xù", href: "bot-chien", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Bột năng/bắp/mì",
        href: "bot-lam-banh",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
    ],
  },

  // 4
  {
    name: "GẠO, BỘT, ĐỒ KHÔ",
    href: "/gao-bot-do-kho",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Gạo thơm, gạo dẻo", href: "gao", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Gạo lứt, ngũ cốc", href: "gao-lut-ngu-coc", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nếp, bột nếp", href: "nep", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Bột mì/bột gạo", href: "bot-mi-bot-gao", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Bột năng, bột bắp", href: "bot-nang-bot-bap", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Đậu, hạt khô", href: "dau-hat", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Rong biển, nấm khô", href: "rong-bien-nam-kho", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Mè, đậu phộng", href: "me-dau-phong", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
    ],
  },

  // 5
  {
    name: "MÌ, MIẾN, CHÁO, PHỞ",
    href: "/mi-mien-chao-pho",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Mì gói", href: "mi-goi", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Mì ly", href: "mi-ly", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Miến, bún khô", href: "mien-bun-kho", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Phở khô", href: "pho-kho", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Cháo ăn liền", href: "chao-an-lien", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nui, pasta", href: "nui-pasta", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
    ],
  },

  // 6
  {
    name: "THỰC PHẨM ĐÔNG MÁT",
    href: "/thuc-pham-dong-mat",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Thực phẩm đông lạnh", href: "dong-lanh", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Hải sản đông lạnh", href: "hai-san-dong", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Rau củ đông lạnh", href: "rau-cu-dong", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Chả giò, thịt viên",
        href: "cha-gio-thit-vien",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      { name: "Đậu hũ, đồ chay mát", href: "do-chay-mat", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Xúc xích, giò chả mát",
        href: "xuc-xich-gio-cha",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      {
        name: "Đồ ăn chế biến sẵn",
        href: "do-che-bien-mat",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
    ],
  },

  // 7
  {
    name: "SỮA CÁC LOẠI",
    href: "/sua",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Sữa tươi/tiệt trùng", href: "sua-tuoi-tiet-trung", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Sữa hạt, sữa đậu nành", href: "sua-hat", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Sữa bột", href: "sua-bot", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Sữa đặc", href: "sua-dac", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Sữa chua uống", href: "sua-chua-uong", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
    ],
  },

  // 8
  {
    name: "KEM, SỮA CHUA",
    href: "/kem-sua-chua",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Sữa chua ăn", href: "sua-chua-an", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Kem que/kem hộp", href: "kem", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Sữa chua uống", href: "sua-chua-uong", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Thạch, rau câu", href: "thach-rau-cau", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
    ],
  },

  // 9
  {
    name: "BIA, NƯỚC GIẢI KHÁT",
    href: "/bia-nuoc-giai-khat",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Bia", href: "bia", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nước ngọt", href: "nuoc-ngot", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nước suối", href: "nuoc-suoi", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nước tăng lực", href: "nuoc-tang-luc", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Trà uống liền", href: "tra-dong-chai", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Cà phê lon, hộp", href: "ca-phe-dong-lon", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nước ép đóng chai", href: "nuoc-ep", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Sữa đậu nành", href: "sua-dau-nanh", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
    ],
  },

  // 10
  {
    name: "BÁNH KẸO CÁC LOẠI",
    href: "/banh-keo-cac-loai",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",  
    subCategories: [
      { name: "Snack", href: "snack", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Bánh quy", href: "banh-quy", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Bánh xốp, bánh gạo",
        href: "banh-xop-banh-gao",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      { name: "Bánh bông lan", href: "banh-bong-lan", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Bánh que/quế", href: "banh-que", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Sô-cô-la", href: "socola", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Kẹo cứng", href: "keo-cung", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Kẹo mềm, kẹo dẻo", href: "keo-mem-deo", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Kẹo gum", href: "keo-gum", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Hạt sấy, trái cây sấy",
        href: "hat-trai-cay-say",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      { name: "Khô bò/khô gà", href: "kho-bo-kho-ga", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
    ],
  },

  // 11
  {
    name: "CHĂM SÓC CÁ NHÂN",
    href: "/cham-soc-ca-nhan",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Dầu gội, dầu xả", href: "dau-goi-dau-xa", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Sữa tắm", href: "sua-tam", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Sữa rửa mặt", href: "sua-rua-mat", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Kem đánh răng, bàn chải",
        href: "kem-danh-rang-ban-chai",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      { name: "Dao cạo, gel cạo râu", href: "dao-cao", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Khăn giấy ướt/khô", href: "khan-giay", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Lăn khử mùi", href: "lan-khu-mui", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Băng vệ sinh", href: "bang-ve-sinh", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Tã người lớn", href: "ta-nguoi-lon", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
    ],
  },

  // 12
  {
    name: "VỆ SINH NHÀ CỬA",
    href: "/ve-sinh-nha-cua",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Bột giặt, nước giặt", href: "bot-nuoc-giat", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nước xả vải", href: "nuoc-xa", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nước rửa chén", href: "nuoc-rua-chen", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Nước lau sàn, lau kính",
        href: "nuoc-lau-san-kinh",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      { name: "Tẩy rửa nhà bếp/nhà tắm", href: "tay-rua", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Giấy vệ sinh, khăn giấy",
        href: "giay-ve-sinh",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      { name: "Túi rác, màng bọc", href: "tui-rac-mang-boc", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Diệt côn trùng", href: "diet-con-trung", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Găng tay, miếng chà",
        href: "gang-tay-mieng-cha",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
    ],
  },

  // 13
  {
    name: "SẢN PHẨM MẸ VÀ BÉ",
    href: "/me-va-be",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Tã/bỉm", href: "ta-bim", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Khăn ướt", href: "khan-uot", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Sữa bột cho bé", href: "sua-bot-be", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Bột/cháo ăn dặm", href: "an-dam", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Sữa tươi cho bé", href: "sua-tuoi-be", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Đồ tắm gội cho bé", href: "tam-goi", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Dụng cụ ăn dặm", href: "dung-cu-an-dam", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Vệ sinh răng miệng bé", href: "ve-sinh-rang-mieng", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
    ],
  },

  // 14
  {
    name: "ĐỒ DÙNG GIA ĐÌNH",
    href: "/do-dung-gia-dinh",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
    subCategories: [
      { name: "Dụng cụ nhà bếp", href: "dung-cu-nha-bep", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Chén, dĩa, muỗng, đũa",
        href: "chen-dia-muong-dua",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      { name: "Ly tách, bình nước", href: "ly-binh", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Hộp đựng, túi zip", href: "hop-tui", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      {
        name: "Màng bọc, giấy bạc",
        href: "mang-boc-giay-bac",
        mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
      },
      { name: "Đồ vệ sinh, cây lau", href: "do-ve-sinh", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Pin, bật lửa, đèn cầy", href: "pin-bat-lua", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
      { name: "Nhang – đèn", href: "nhang-den", mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png" },
    ],
  },

  // 15 (điều hướng)
  {
    name: "ƯU ĐÃI TỪ HÃNG",
    href: "/uu-dai-tu-hang",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
  },

  // 16 (điều hướng)
  {
    name: "XEM CỬA HÀNG",
    href: "/cua-hang",
    mobileImage: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"
  },
];

export function CategorySidebar({
  isMobile = false,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleCategoryClick = (category: Category) => {
    // Nếu có subCategories thì set category đó làm active, nếu không thì navigate
    if (category.subCategories) {
      // Trên mobile: luôn set category được click làm active (không toggle)
      if (isMobile) {
        setExpandedCategories([category.name]);
      } else {
        // Desktop: toggle như cũ
        toggleCategory(category.name);
      }
    } else {
      // Lấy category ID từ href (bỏ dấu / ở đầu)
      const categoryId = category.href.replace("/", "");
      navigate(`/products?category=${categoryId}`);
      if (isMobile) {
        onClose?.();
      }
    }
  };

  const handleSubCategoryClick = (subCategory: { name: string; href: string; mobileImage?: string }) => {
    navigate(`/products?category=${subCategory.href}`);
    if (isMobile) {
      onClose?.();
    }
  };

  // Mobile Layout - Bách Hóa Xanh Style
  if (isMobile) {
    const selectedCategory = categories.find(cat => expandedCategories.includes(cat.name));
    
    return (
      <aside className="fixed inset-0 w-full h-full bg-white flex flex-col z-50">
        {/* Header */}
        <div className="text-gray-800 p-4 font-bold text-sm uppercase flex-shrink-0 flex items-center justify-between border-b-2">
          <span>Danh mục sản phẩm</span>
          {onClose && (
            <button
              onClick={onClose}
              className="hover:bg-gray-100 rounded p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Mobile Two Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column - Categories List (1/3) */}
          <div className="w-1/3 bg-gray-50 overflow-y-auto border-r border-gray-200">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category)}
                className={cn(
                  "w-full p-3 text-left text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100",
                  expandedCategories.includes(category.name) && "bg-white text-primary font-semibold",
                  category.name === "KHUYẾN MÃI SỐC" && "text-red-600"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Right Column - Subcategories Grid (2/3) */}
          <div className="w-2/3 overflow-y-auto p-4">
            {selectedCategory && selectedCategory.subCategories ? (
              <div className="grid grid-cols-2 gap-3">
                {selectedCategory.subCategories.map((subCategory) => (
                  <button
                    key={subCategory.name}
                    onClick={() => handleSubCategoryClick(subCategory)}
                    className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-sm transition-all"
                  >
                    <div className="w-12 h-12 mb-2 mx-auto">
                      <img 
                        src={subCategory.mobileImage || "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png"} 
                        alt={subCategory.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png";
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-700 leading-tight font-medium">
                      {subCategory.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Chọn danh mục để xem sản phẩm
              </div>
            )}
          </div>
        </div>
      </aside>
    );
  }

  // Desktop Layout
  return (
    <aside
      className={cn(
        "w-64 bg-white border-r border-gray-200 flex flex-col z-10 2xl:ml-33",
        "h-[98%] fixed left-0 top-0 bottom-0 hidden lg:flex pt-[88px]"
      )}
    >
      {/* Header */}
      <div className="text-gray-800 p-4 font-bold text-sm uppercase flex-shrink-0 flex items-center justify-between border-b-2">
        <span>Danh mục sản phẩm</span>
      </div>

      {/* Categories */}
      <nav className="py-2 overflow-y-auto flex-1 no-scrollbar">
        {categories.map((category) => (
          <div key={category.name} className="border-b border-gray-100">
            {/* Parent Category */}
            <button
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50 transition-colors",
                category.name === "KHUYẾN MÃI SỐC" && "text-red-600"
              )}
            >
              <div className="flex items-center gap-2">
                <span>{category.name}</span>
              </div>
              {category.subCategories && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform text-gray-400",
                    expandedCategories.includes(category.name) && "rotate-180"
                  )}
                />
              )}
            </button>

            {/* Sub Categories */}
            {category.subCategories &&
              expandedCategories.includes(category.name) && (
                <div className="bg-gray-50 py-1">
                  {category.subCategories.map((subCategory) => (
                    <Link
                      key={subCategory.name}
                      to={`/products?category=${subCategory.href}`}
                      className="block px-4 py-2 pl-8 text-sm text-gray-700 hover:text-primary hover:bg-white transition-colors"
                    >
                      {subCategory.name}
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>
    </aside>
  );
}