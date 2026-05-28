import sys
import os
import json
from typing import Optional, Dict, Any
from PIL import Image
from google import genai
from google.genai import types
from pydantic import BaseModel, Field, field_validator
import re
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')

# 🌟 تحميل المتغيرات من ملف .env
load_dotenv()

class SyrianIDModel(BaseModel):
    first_name: str = Field(..., description="الاسم الأول المكتوب بجانب حقل الاسم")
    last_name: str = Field(..., description="الكنية أو النسبة المكتوبة بجانب حقل النسبة")
    father_name: str = Field(..., description="اسم الأب المكتوب بجانب حقل اسم الأب")
    mother_name: str = Field(..., description="اسم ونسبة الأم بالكامل المكتوب بجانب حقل اسم ونسبة الأم")
    birth_place_and_date: str = Field(..., description="محل وتاريخ الولادة")
    national_number: str = Field(..., description="الرقم الوطني المكون من 11 رقماً")

    @field_validator('national_number')
    @classmethod
    def sanitize_national_number(cls, v: str) -> str:
        arabic_norms = str.maketrans('٠١٢٣٤٥٦٧٨٩', '0123456789')
        sanitized = v.translate(arabic_norms).strip()
        sanitized = re.sub(r'\D', '', sanitized)
        if len(sanitized) == 10:
            sanitized = "0" + sanitized
        return sanitized

class YaqeenOCRService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.client = genai.Client(api_key=self.api_key)
        self.model_name = 'gemini-2.5-flash'

    def process_id_card(self, image_path: str) -> Dict[str, Any]:
        if not os.path.exists(image_path):
            return {"status": "error", "message": f"الملف غير موجود: {image_path}"}
        try:
            with Image.open(image_path) as img:
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                strong_prompt = (
                    "أنت نظام تدقيق حكومي متقدم ومحرك OCR فائق الدقة مخصص لمنصة 'يقين' الرقمية.\n"
                    "مهمتك الصارمة هي قراءة صورة البطاقة الشخصية السورية المرفقة واستخراج النص المقابل لكل حقل بدقة حرفية.\n\n"
                    "شروط المعالجة:\n"
                    "1. التزم بالنص المكتوب تماماً ولا تقم بتصحيح الأخطاء الإملائية أو تخمين الحروف الناقصة.\n"
                    "2. استخرج الرقم الوطني كاملاً كما هو مطبوع (انتبه للصفر في بداية الرقم من اليسار).\n"
                    "3. افصل تماماً بين النص الأساسي والزخارف الخلفية الملونة للهوية.\n"
                    "4. إذا كان هناك حقل غير واضح، لا تبتكر قيمة من عندك بل انقل الحروف الأقرب للوضوح."
                )

                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=[img, strong_prompt],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=SyrianIDModel,
                        temperature=0.0,
                    ),
                )
                return {"status": "success", "data": response.text}
        except Exception as e:
            return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "لم يتم تمرير مسار الصورة."}))
        sys.exit(1)

    IMAGE_FILE = sys.argv[1]
    
    # 🌟 قراءة المفتاح من البيئة بدلاً من كتابته في الكود
    MY_API_KEY = os.getenv("ACTIVE_API_KEY") 
    
    if not MY_API_KEY:
        print(json.dumps({"status": "error", "message": "مفتاح API غير موجود. تأكد من إعداده في ملف .env"}))
        sys.exit(1)
        
    ocr_engine = YaqeenOCRService(api_key=MY_API_KEY)
    result = ocr_engine.process_id_card(IMAGE_FILE)
    
    if result["status"] == "success":
        print(result["data"])
    else:
        print(json.dumps(result, ensure_ascii=False))