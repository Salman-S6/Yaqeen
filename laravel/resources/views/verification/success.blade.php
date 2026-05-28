<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>وثيقة معتمدة - يقين</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }</style>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen p-4">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border-t-8 border-green-500">
        <div class="p-6 text-center bg-green-50">
            <div class="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1 class="text-2xl font-bold text-green-800">وثيقة أصلية ومعتمدة</h1>
            <p class="text-green-600 mt-2 text-sm">تم التحقق من صحة التوقيع الرقمي</p>
        </div>
        <div class="p-6 space-y-4">
            <div class="border-b pb-3"><p class="text-xs text-gray-500">رقم الطلب</p><p class="font-bold text-gray-800">{{ $data['request_number'] }}</p></div>
            <div class="border-b pb-3"><p class="text-xs text-gray-500">اسم المواطن</p><p class="font-bold text-gray-800">{{ $data['citizen_name'] }}</p></div>
            <div class="border-b pb-3"><p class="text-xs text-gray-500">الرقم الوطني</p><p class="font-bold text-gray-800" style="letter-spacing: 2px;">{{ $data['national_id'] }}</p></div>
            <div class="border-b pb-3"><p class="text-xs text-gray-500">نوع الخدمة المعتمدة</p><p class="font-bold text-blue-600">{{ $data['service'] }}</p></div>
            <div><p class="text-xs text-gray-500">تاريخ الإصدار</p><p class="font-semibold text-gray-800">{{ \Carbon\Carbon::parse($data['issued_at'])->format('Y-m-d H:i') }}</p></div>
        </div>
        <div class="bg-gray-100 p-4 text-center text-xs text-gray-500">
            تم التحقق بواسطة نظام <strong>يقين</strong> الذكي
        </div>
    </div>
</body>
</html>
