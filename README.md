# مشروع يَقِين (Yaqeen)

منصة رقمية مركزية للخدمات الحكومية تهدف إلى تحويل المعاملات الورقية التقليدية إلى تجربة رقمية أكثر سرعة وأمانًا، مع دعم رفع المرفقات، التحقق من بيانات الهوية عبر OCR، إدارة الطلبات من قبل الموظفين، وإصدار وثائق رقمية قابلة للتحقق عبر QR موقّع رقميًا.

تم بناء المشروع كمنظومة متكاملة متعددة الأجزاء تضم:

- **Laravel Backend**: واجهات API، إدارة المستخدمين والصلاحيات، الطلبات، الوثائق، الإشعارات، التحقق الرقمي، وربط محرك OCR.
- **React Frontend**: لوحة ويب للموظفين ومدير النظام لإدارة الطلبات، المستخدمين، الخدمات، الإحصائيات، السجلات، ومراقبة OCR.
- **Flutter Mobile App**: تطبيق موبايل للمواطن لتسجيل الحساب، إرسال الطلبات، متابعة الحالة، عرض الوثائق، ومسح QR للتحقق.
- **Python OCR Engine**: محرك OCR مستقل يعتمد على Gemini لاستخراج بيانات البطاقة الشخصية السورية من صورة الهوية.

---

## 1. المشكلة التي يعالجها النظام

تعاني الخدمات الحكومية التقليدية من الاعتماد الكبير على الورق، الحضور الفيزيائي، الأختام، المطابقة اليدوية، وتكرار إدخال البيانات. يؤدي ذلك إلى:

- هدر وقت المواطن والموظف.
- زيادة تكاليف التنقل والطباعة والأرشفة.
- ضعف القدرة على تتبع الطلبات والسجلات.
- ارتفاع احتمالية الأخطاء البشرية.
- صعوبة التحقق من الوثائق الصادرة.
- ضعف الشفافية في دورة حياة المعاملة.

يأتي مشروع **يَقِين** كحل برمجي يخفف هذه المشاكل عبر رقمنة دورة الطلب، أتمتة جزء من قراءة البيانات، وتوفير وثيقة نهائية يمكن التحقق منها رقميًا.

---

## 2. فكرة الحل

يعتمد النظام على أربعة محاور رئيسية:

### 2.1 أتمتة قراءة الهوية OCR

عند تسجيل المواطن، يتم رفع صورة الهوية الشخصية. يقوم Backend باستدعاء محرك Python OCR، والذي يرسل الصورة إلى Gemini لاستخراج حقول الهوية الأساسية مثل:

- الاسم الأول.
- الكنية.
- اسم الأب.
- اسم الأم.
- مكان وتاريخ الولادة.
- الرقم الوطني.

بعدها يقوم Laravel بحساب نسبة مطابقة بين البيانات المدخلة والبيانات المستخرجة من الصورة، ولا يتم اعتماد التحقق إذا كانت النسبة أقل من الحد المطلوب.

### 2.2 إدارة الطلبات والصلاحيات

يوفر Laravel نظام أدوار وصلاحيات باستخدام Sanctum و Spatie Permission، مع أدوار أساسية:

- مدير النظام Admin.
- موظف Employee.
- مواطن Citizen.

### 2.3 التوقيع الرقمي والتحقق عبر QR

عند اعتماد الطلب، يقوم النظام بإنشاء وثيقة رقمية وتوليد QR يحتوي على رابط تحقق موقّع رقميًا باستخدام RSA. يمكن لأي جهة خارجية فتح رابط التحقق للتأكد من أن الوثيقة سليمة وغير مزورة.

---

## 3. هيكلية المستودع

المشروع مصمم على شكل Monorepo، أي أن جميع الأجزاء موجودة داخل مستودع واحد:

```txt
Yaqeen/
├── laravel/
├── react/
├── flutter_app/
├── python_ocr/
└── README.md
```

---

## 4. التقنيات المستخدمة

### Backend

- PHP 8.2+
- Laravel 12
- Laravel Sanctum
- Spatie Laravel Permission
- OpenSSL RSA Signing
- MySQL
- Queue / Notifications
- Mail Log

### Web Frontend

- React
- Vite
- Axios
- React Router
- CSS Modules
- React Icons
- Recharts
- ESLint

### Mobile App

- Flutter
- Dart
- Dio
- Flutter Bloc
- Shared Preferences
- Image Picker
- Mobile Scanner
- QR Flutter
- PDF / Printing
- Crypto / Encrypt / RSA / Elliptic
- Tajawal Font

### OCR Engine

- Python
- Google GenAI SDK
- Gemini 2.5 Flash
- Pydantic
- Pillow
- python-dotenv

---

## 5. Laravel Backend

### 5.1 الدور العام

مجلد `laravel/` هو مركز النظام الأساسي. يقوم بتنفيذ:

- تسجيل وتسجيل دخول المستخدمين.
- إدارة الجلسات باستخدام Sanctum tokens.
- إدارة الأدوار والصلاحيات.
- تسجيل المواطنين والتحقق من الهوية باستخدام OCR.
- إنشاء الطلبات وتوجيهها تلقائيًا لموظف متاح.
- عرض الطلبات حسب دور المستخدم.
- اعتماد أو رفض الطلبات.
- إنشاء وثيقة رقمية بعد الاعتماد.
- توليد QR موقّع رقميًا للتحقق الخارجي.
- حفظ سجلات التحقق، OCR، والتدقيق.
- إرسال إشعارات للمواطن عند استلام الطلب أو قبوله أو رفضه.

### 5.2 أهم المجلدات داخل Laravel

```txt
laravel/
├── app/
│   ├── Console/Commands/GenerateRSAKeys.php
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/CheckPermission.php
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   ├── Services/
│   ├── Mail/
│   └── Notifications/
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php
│   └── web.php
└── composer.json
```

### 5.3 أهم Models

| Model             | الغرض                                                   |
| ----------------- | ------------------------------------------------------- |
| `User`            | حسابات المستخدمين، الأدوار، الحالة، والبيانات الأساسية. |
| `Citizen`         | ملف المواطن المرتبط بحساب المستخدم.                     |
| `Request`         | الطلب الحكومي المقدم من المواطن.                        |
| `ServiceType`     | أنواع الخدمات المتاحة مثل إخراج قيد فردي وبيان عائلي.   |
| `Attachment`      | المرفقات المرفوعة مثل صورة الهوية.                      |
| `OCRResult`       | نتيجة استخراج البيانات من OCR.                          |
| `Document`        | الوثيقة الصادرة بعد اعتماد الطلب.                       |
| `QRCode`          | الحمولة الرقمية الخاصة بالتحقق.                         |
| `Notification`    | إشعارات المواطن.                                        |
| `AuditLog`        | سجلات التدقيق.                                          |
| `VerificationLog` | سجلات التحقق الخارجي من الوثائق.                        |
| `RejectionReason` | سبب رفض الطلب عند الرفض.                                |

### 5.4 أهم Services

| Service                       | الوظيفة                                                                   |
| ----------------------------- | ------------------------------------------------------------------------- |
| `AuthService`                 | التسجيل، تسجيل الدخول، الخروج، إنشاء المواطن، واستدعاء OCR أثناء التسجيل. |
| `OCRService`                  | استدعاء سكربت Python OCR وحفظ النتيجة.                                    |
| `IdentityVerificationService` | حساب نسبة مطابقة بيانات المواطن مع بيانات OCR.                            |
| `RequestService`              | إنشاء الطلبات، منع التكرار، الاعتماد، الرفض، وتوليد الوثيقة والـ QR.      |
| `AutoAssignService`           | اختيار موظف متاح لإسناد الطلب إليه.                                       |
| `NotificationService`         | إنشاء وإرسال إشعارات استلام، قبول، ورفض الطلب.                            |
| `SignatureService`            | توقيع بيانات الوثيقة باستخدام RSA وتوليد رابط التحقق.                     |
| `EmployeeDashboardService`    | إحصائيات لوحة الموظف.                                                     |
| `AdminDashboardService`       | أداء الموظفين ومؤشرات SLA.                                                |
| `AdminStatsService`           | إحصائيات عامة ومخططات للوحة الإدارة.                                      |
| `AdminOcrService`             | بيانات مراقبة نتائج OCR.                                                  |

### 5.5 نظام الصلاحيات

تم تعريف الصلاحيات عبر `RolePermissionSeeder`.

| الدور    | الصلاحيات الرئيسية                                          |
| -------- | ----------------------------------------------------------- |
| Admin    | جميع الصلاحيات.                                             |
| Employee | عرض الطلبات، قبول الطلبات، رفض الطلبات، عرض أنواع الخدمات.  |
| Citizen  | إنشاء الطلبات، عرض طلباته، رفع المرفقات، عرض أنواع الخدمات. |

أمثلة على الصلاحيات:

```txt
manage_employees
manage_citizens
manage_permissions
view_requests
create_requests
approve_requests
reject_requests
upload_attachments
view_service_types
create_service_types
update_service_types
delete_service_types
view_statistics
view_audit_logs
view_ocr_logs
view_verification_logs
```

### 5.6 أهم API Routes

#### Auth

| Method | Endpoint             | الوصف                            |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/auth/register` | تسجيل مواطن جديد مع صورة الهوية. |
| POST   | `/api/auth/login`    | تسجيل الدخول.                    |
| GET    | `/api/auth/me`       | جلب المستخدم الحالي.             |
| POST   | `/api/auth/logout`   | تسجيل الخروج.                    |

#### Requests

| Method | Endpoint                     | الوصف                         |
| ------ | ---------------------------- | ----------------------------- |
| GET    | `/api/requests`              | عرض الطلبات حسب دور المستخدم. |
| POST   | `/api/requests`              | إنشاء طلب جديد.               |
| GET    | `/api/requests/{id}`         | عرض تفاصيل طلب.               |
| POST   | `/api/requests/{id}/approve` | اعتماد طلب.                   |
| POST   | `/api/requests/{id}/reject`  | رفض طلب مع سبب.               |

#### Attachments

| Method | Endpoint                     | الوصف                     |
| ------ | ---------------------------- | ------------------------- |
| POST   | `/api/attachments`           | رفع مرفق.                 |
| GET    | `/api/attachments/{id}/view` | عرض مرفق عبر رابط signed. |

#### Service Types

| Method | Endpoint                  | الوصف           |
| ------ | ------------------------- | --------------- |
| GET    | `/api/service-types`      | عرض الخدمات.    |
| GET    | `/api/service-types/{id}` | عرض خدمة محددة. |
| POST   | `/api/service-types`      | إضافة خدمة.     |
| PUT    | `/api/service-types/{id}` | تعديل خدمة.     |
| DELETE | `/api/service-types/{id}` | حذف خدمة.       |

#### Admin

| Method | Endpoint                                 | الوصف                      |
| ------ | ---------------------------------------- | -------------------------- |
| GET    | `/api/admin/employees`                   | عرض الموظفين.              |
| POST   | `/api/admin/employees`                   | إضافة موظف.                |
| GET    | `/api/admin/employees/{id}`              | عرض موظف.                  |
| PUT    | `/api/admin/employees/{id}`              | تعديل موظف.                |
| DELETE | `/api/admin/employees/{id}`              | حذف موظف.                  |
| GET    | `/api/admin/employees/{id}/permissions`  | عرض صلاحيات موظف.          |
| PUT    | `/api/admin/employees/{id}/permissions`  | تحديث صلاحيات موظف.        |
| GET    | `/api/admin/citizens`                    | عرض المواطنين.             |
| GET    | `/api/admin/citizens/{id}`               | تفاصيل مواطن.              |
| PATCH  | `/api/admin/citizens/{id}/toggle-status` | تفعيل/تعطيل مواطن.         |
| GET    | `/api/admin/dashboard`                   | أداء الموظفين ومؤشرات SLA. |
| GET    | `/api/admin/stats`                       | إحصائيات النظام.           |
| GET    | `/api/admin/verification-logs`           | سجلات التحقق الخارجي.      |
| GET    | `/api/admin/ocr-logs`                    | سجلات OCR.                 |
| GET    | `/api/admin/audit-logs`                  | سجلات التدقيق.             |

#### Employee

| Method | Endpoint                  | الوصف                              |
| ------ | ------------------------- | ---------------------------------- |
| GET    | `/api/employee/dashboard` | لوحة الموظف والطلبات المسندة إليه. |

#### Notifications

| Method | Endpoint                       | الوصف                       |
| ------ | ------------------------------ | --------------------------- |
| GET    | `/api/notifications`           | عرض إشعارات المستخدم.       |
| PATCH  | `/api/notifications/{id}/read` | تعليم إشعار كمقروء.         |
| POST   | `/api/notifications/read-all`  | تعليم كل الإشعارات كمقروءة. |

#### Public Verification

| Method | Endpoint                        | الوصف                              |
| ------ | ------------------------------- | ---------------------------------- |
| GET    | `/verify?req=...&p=...&sig=...` | التحقق العام من وثيقة رقمية موقعة. |

### 5.7 متغيرات البيئة المهمة في Laravel

ملف `.env.example` يحتوي على متغيرات مهمة، منها:

```env
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
PYTHON_BINARY=
OCR_SCRIPT_PATH=
OPENSSL_CNF_PATH=
PRIVATE_KEY=
PUBLIC_KEY=
```

ملاحظات:

- يمكن استخدام SQLite كما في الملف الافتراضي، أو تعديل الإعدادات لاستخدام MySQL.
- يجب ضبط `PYTHON_BINARY` إذا كان مسار Python مختلفًا.
- يجب ضبط `OCR_SCRIPT_PATH` ليشير إلى ملف `python_ocr/ocr.py`.
- يجب توليد مفاتيح RSA قبل اعتماد الوثائق.

### 5.8 توليد مفاتيح RSA

يوجد أمر مخصص:

```bash
php artisan keys:generate-rsa
```

يقوم هذا الأمر بتوليد `PRIVATE_KEY` و `PUBLIC_KEY` وتخزينهما داخل ملف `.env`.

### 5.9 تشغيل Laravel

```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan keys:generate-rsa
php artisan serve
```

إذا تم استخدام Queue للإشعارات:

```bash
php artisan queue:work
```

حساب المدير الافتراضي بعد تشغيل Seeders:

```txt
Email: admin@yaqeen.test
Password: Password@123
```

> هذا الحساب مخصص للتجربة المحلية فقط، ويجب تغييره أو حذفه قبل أي نشر حقيقي.

---

## 6. React Frontend

### 6.1 الدور العام

مجلد `react/` يحتوي على واجهة ويب مخصصة لمدير النظام والموظف. الواجهة تعتمد على API القادم من Laravel وتستخدم Axios لإرسال التوكن مع الطلبات.

### 6.2 أهم الميزات

#### للموظف

- تسجيل الدخول.
- عرض لوحة الموظف.
- عرض الطلبات المعلقة المسندة إليه.
- مراجعة تفاصيل الطلب وصورة الهوية.
- قبول الطلب.
- رفض الطلب مع سبب.
- عرض الملف الشخصي.

#### لمدير النظام

- إدارة الموظفين.
- إدارة صلاحيات الموظفين.
- إدارة الخدمات الحكومية.
- عرض جميع الطلبات.
- مراجعة الطلبات من وضع الإدارة.
- إحصائيات النظام.
- أداء الموظفين.
- مراقبة OCR.
- سجلات التحقق QR.
- سجلات التدقيق Audit Logs.
- إدارة المواطنين.

### 6.3 أهم ملفات React

```txt
react/
├── src/
│   ├── api/
│   │   ├── axios.js
│   │   ├── authService.js
│   │   ├── employeeRequestService.js
│   │   ├── employeeService.js
│   │   └── serviceTypeService.js
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── index.html
└── .env.example
```

### 6.4 إعداد API في React

ملف `.env.example`:

```env
VITE_API_BASE_URL=https://your-ngrok-url/api
```

للتشغيل المحلي يمكن استخدام:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

يجب إعادة تشغيل Vite بعد أي تعديل على `.env`.

### 6.5 Axios

ملف `src/api/axios.js` يقوم بـ:

- ضبط `baseURL`.
- إرسال `Accept: application/json`.
- إرسال `Authorization: Bearer <token>` إذا كان التوكن موجودًا في `localStorage`.
- التعامل مع أخطاء `401` و `419` عبر حذف بيانات الجلسة.
- إضافة headers خاصة بتجاوز صفحات ngrok التحذيرية أثناء التطوير.

### 6.6 حماية Routes

يستخدم React مكون `ProtectedRoute` لحماية صفحات الموظف والمدير. كذلك يتم استدعاء `/auth/me` للتحقق من المستخدم الحالي، بدل الاعتماد فقط على `localStorage`.

### 6.7 أهم مسارات الواجهة

```txt
/login
/employee/dashboard
/employee/pending-requests
/employee/review-request/:requestId
/employee/profile
/admin/users
/admin/all-requests
/admin/review-request/:requestId
/admin/stats
/admin/performance
/admin/ocr
/admin/verify-qr
/admin/services
/admin/audit-logs
/admin/profile
```

### 6.8 تشغيل React

```bash
cd react
npm install
npm run dev
```

بناء نسخة Production:

```bash
npm run build
```

فحص الكود:

```bash
npm run lint
```

---

## 7. Flutter Mobile App

### 7.1 الدور العام

مجلد `flutter_app/` يحتوي على تطبيق الموبايل الخاص بالمواطن. التطبيق يوفر واجهة عربية للمواطن للتسجيل، تسجيل الدخول، تقديم الطلبات، متابعة حالتها، واستعراض الوثائق والتحقق من QR.

### 7.2 أهم الميزات

- تسجيل حساب مواطن جديد مع رفع صورة الهوية.
- تسجيل الدخول وحفظ التوكن محليًا.
- جلب بيانات المستخدم الحالي.
- عرض أنواع الخدمات المتاحة.
- إنشاء طلب جديد.
- عرض قائمة الطلبات.
- عرض تفاصيل الطلب.
- تصدير بيانات الطلب إلى PDF.
- عرض QR للوثائق عند توفره.
- مسح QR للتحقق.
- عرض شاشة نجاح أو تحذير عند التحقق من QR.
- عرض الإشعارات وتعليمها كمقروءة.
- واجهة عربية بخط Tajawal.

### 7.3 بنية Flutter

```txt
flutter_app/lib/
├── core/
│   ├── constants/
│   ├── network/
│   ├── utils/
│   └── widgets/
├── features/
│   ├── auth/
│   ├── citizen/
│   ├── notifications/
│   └── qr_verification/
└── main.dart
```

### 7.4 المعمارية المستخدمة

يعتمد التطبيق على تقسيم Feature-Based Architecture مع Bloc:

- `data/models`: نماذج البيانات.
- `data/repositories`: التعامل مع API.
- `presentation/bloc`: Events / States / Bloc.
- `presentation/screens`: الشاشات.

### 7.5 الاتصال مع Backend

ملف:

```txt
flutter_app/lib/core/network/api_endpoints.dart
```

يحتوي على:

```dart
static const String baseUrl = "https://septifragally-unprotesting-darcie.ngrok-free.dev/api";
```

قبل التشغيل على جهاز آخر أو عند تغيير رابط ngrok يجب تعديل `baseUrl` إلى رابط الـ API الصحيح.

مثال محلي عند استخدام Android Emulator:

```dart
static const String baseUrl = "http://10.0.2.2:8000/api";
```

مثال عند استخدام جهاز حقيقي على نفس الشبكة:

```dart
static const String baseUrl = "http://YOUR_PC_LOCAL_IP:8000/api";
```

### 7.6 Dio Client

ملف `dio_client.dart` يقوم بـ:

- ضبط `baseUrl`.
- تحديد مهلة الاتصال والاستجابة.
- قراءة `auth_token` من `SharedPreferences`.
- إرسال التوكن داخل Header مع كل طلب:

```txt
Authorization: Bearer <token>
```

### 7.7 أهم Features

#### Auth

```txt
login_screen.dart
register_screen.dart
forgot_password_screen.dart
auth_repository.dart
auth_bloc.dart
```

الوظائف:

- Login.
- Register مع رفع صورة الهوية كـ MultipartFile.
- Logout.
- getMe.
- حفظ وحذف التوكن.

#### Citizen

```txt
citizen_home_screen.dart
new_request_screen.dart
request_form_screen.dart
requests_list_screen.dart
request_detail_screen.dart
profile_details_screen.dart
settings_screen.dart
```

الوظائف:

- عرض الخدمات.
- إنشاء الطلبات.
- عرض الطلبات.
- عرض التفاصيل.
- تصدير PDF.

#### Notifications

```txt
notifications_screen.dart
notification_repository.dart
notification_bloc.dart
```

الوظائف:

- جلب الإشعارات.
- عرض عدد غير المقروء.
- تعليم إشعار كمقروء.

#### QR Verification

```txt
qr_scan_screen.dart
qr_success_screen.dart
qr_forged_screen.dart
local_qr_repository.dart
qr_bloc.dart
```

الوظائف:

- مسح QR بالكاميرا.
- تحليل الرابط الممسوح.
- التحقق من سلامة بيانات الوثيقة.
- عرض نتيجة سليمة أو مزورة.

### 7.8 تشغيل Flutter

```bash
cd flutter_app
flutter pub get
flutter run
```

بناء APK:

```bash
flutter build apk
```

بناء Web:

```bash
flutter build web
```

---

## 8. Python OCR Engine

### 8.1 الدور العام

مجلد `python_ocr/` يحتوي على سكربت مستقل يتم استدعاؤه من Laravel عبر `Symfony Process`. الهدف منه قراءة صورة الهوية الشخصية واستخراج الحقول المطلوبة بصيغة JSON.

### 8.2 الملفات

```txt
python_ocr/
├── .env.example
├── .gitignore
├── ocr.py
└── requirements.txt
```

### 8.3 المتطلبات

```txt
google-genai
pydantic
pillow
python-dotenv
```

### 8.4 طريقة العمل

1. يستقبل السكربت مسار الصورة من سطر الأوامر.
2. يقرأ مفتاح Gemini من ملف `.env`.
3. يفتح الصورة باستخدام Pillow.
4. يحول الصورة إلى RGB إذا لزم الأمر.
5. يرسل الصورة مع Prompt واضح إلى Gemini 2.5 Flash.
6. يطلب من Gemini إرجاع JSON مطابق لـ `SyrianIDModel`.
7. يعيد النتيجة إلى Laravel بصيغة JSON.

### 8.5 الحقول المستخرجة

```txt
first_name
last_name
father_name
mother_name
birth_place_and_date
national_number
```

### 8.6 تنظيف الرقم الوطني

يحتوي `SyrianIDModel` على validator يقوم بـ:

- تحويل الأرقام العربية `٠١٢٣٤٥٦٧٨٩` إلى أرقام إنكليزية.
- حذف الرموز غير الرقمية.
- إضافة صفر في البداية إذا كان الرقم 10 خانات.

### 8.7 إعداد متغيرات البيئة

ملف `.env.example`:

```env
GEMINI_API_KEY=
```

في النسخة الحالية من السكربت، يتم قراءة المفتاح من:

```env
ACTIVE_API_KEY=
```

لذلك عند التشغيل يجب التأكد من وضع المفتاح باسم `ACTIVE_API_KEY` داخل `.env`، أو تعديل السكربت ليقبل `GEMINI_API_KEY` أيضًا.

مثال:

```env
ACTIVE_API_KEY=your_api_key_here
```

### 8.8 تشغيل OCR يدويًا

```bash
cd python_ocr
pip install -r requirements.txt
python ocr.py path/to/id-image.jpg
```

### 8.9 ملاحظة مهمة عن النسخة الحالية

حسب الملفات الحالية، محرك OCR يرسل الصورة إلى Gemini بعد التحقق فقط من وجود الملف وفتح الصورة. لا يوجد في النسخة الحالية تابع محلي متقدم للتأكد من أن الصورة هي بطاقة هوية قبل إرسالها إلى Gemini. يمكن إضافة هذا التحسين لاحقًا لتقليل استهلاك محاولات OCR على الصور غير المناسبة.

---

## 9. دورة العمل الكاملة للنظام

### 9.1 تسجيل المواطن

1. المواطن يفتح تطبيق Flutter.
2. يدخل بياناته الشخصية.
3. يرفع صورة الهوية.
4. Flutter يرسل البيانات إلى Laravel عبر `/api/auth/register`.
5. Laravel يحفظ المستخدم والمواطن داخل Transaction.
6. Laravel يستدعي Python OCR.
7. Python OCR يستخرج بيانات الهوية عبر Gemini.
8. Laravel يحسب نسبة المطابقة.
9. إذا كانت النسبة أقل من 70%، يتم رفض التسجيل برسالة واضحة.
10. إذا نجحت المطابقة، يتم حفظ نتيجة OCR والمرفق وتفعيل المواطن.
11. يتم إنشاء Token للمواطن.

### 9.2 تقديم طلب

1. المواطن يختار نوع الخدمة من Flutter.
2. التطبيق يرسل الطلب إلى `/api/requests`.
3. Laravel يمنع تكرار طلب معلق لنفس الخدمة.
4. Laravel يختار موظفًا متاحًا عبر `AutoAssignService`.
5. يتم إنشاء رقم طلب مثل:

```txt
REQ-20260601-0001
```

1. يتم إرسال إشعار استلام للمواطن.

### 9.3 مراجعة الطلب من الموظف

1. الموظف يدخل من React Web.
2. يظهر الطلب في لوحة الموظف.
3. الموظف يفتح تفاصيل الطلب.
4. يراجع بيانات المواطن والمرفقات.
5. يقرر الاعتماد أو الرفض.

### 9.4 اعتماد الطلب

1. الموظف يضغط اعتماد.
2. Laravel يتأكد أن الطلب مسند لنفس الموظف.
3. Laravel يمنع اعتماد طلب تمت معالجته سابقًا.
4. يتم تغيير الحالة إلى `approved`.
5. يتم إنشاء Document.
6. يتم توليد Payload للوثيقة.
7. يتم توقيع Payload عبر RSA.
8. يتم إنشاء Verify URL.
9. يتم حفظ QR Code.
10. يتم إرسال إشعار قبول للمواطن.

### 9.5 رفض الطلب

1. الموظف يكتب سبب الرفض.
2. Laravel يتأكد أن الطلب مسند له.
3. يتم تغيير الحالة إلى `rejected`.
4. يتم حفظ سبب الرفض.
5. يتم إرسال إشعار رفض للمواطن.

### 9.6 التحقق من الوثيقة

1. جهة خارجية تمسح QR.
2. يتم فتح رابط `/verify`.
3. Laravel يتحقق من وجود الوثيقة.
4. Laravel يستخدم `PUBLIC_KEY` للتحقق من التوقيع.
5. يتم حفظ محاولة التحقق داخل `verification_logs`.
6. تظهر صفحة نجاح إذا كانت الوثيقة صحيحة.
7. تظهر صفحة تحذير إذا كانت الوثيقة مزورة أو تم التلاعب بها.

---

## 10. قواعد البيانات والجداول الأساسية

المشروع يحتوي على Migrations للجداول التالية:

```txt
users
citizens
service_types
requests
attachments
ocr_results
documents
qr_codes
rejection_reasons
verification_logs
notifications
audit_logs
personal_access_tokens
permission tables
cache
jobs
```

العلاقات الأساسية:

- User لديه Citizen عند دور المواطن.
- Citizen لديه Requests و Attachments.
- Request ينتمي إلى Citizen و ServiceType و Employee.
- Request يمكن أن ينتج Document.
- Document لديه QRCode.
- Document لديه VerificationLogs.
- Attachment يمكن أن يكون polymorphic مرتبطًا بمواطن أو طلب.
- OCRResult مرتبط بمرفق.
- Notification مرتبطة بالمستخدم والطلب.

---

## 11. الإشعارات

يدعم النظام إشعارات داخلية مرتبطة بدورة الطلب:

- عند استلام الطلب: `received`.
- عند قبول الطلب: `accepted`.
- عند رفض الطلب: `rejected`.

يتم حفظ الإشعار في قاعدة البيانات، كما يمكن دفعه عبر نظام Laravel Notifications حسب إعدادات البيئة.

---

## 12. الأمان

### 12.1 المصادقة

- Laravel Sanctum لإنشاء API Tokens.
- React يحفظ التوكن في `localStorage`.
- Flutter يحفظ التوكن في `SharedPreferences`.
- Axios و Dio يرسلان التوكن مع الطلبات.

### 12.2 الصلاحيات

- Spatie Permission لإدارة الأدوار والصلاحيات.
- Middleware `CheckPermission` يمنع الوصول إلى endpoint دون صلاحية.
- حماية Frontend ليست بديلًا عن حماية Backend، لكنها تحسن تجربة المستخدم.

### 12.3 حماية المرفقات

- التحقق من نوع الملف.
- منع أسماء الملفات المشبوهة.
- تخزين المرفقات باسم UUID.
- عرض المرفقات عبر signed URL مؤقت.

### 12.4 التوقيع الرقمي

- استخدام RSA + SHA256.
- `PRIVATE_KEY` للتوقيع.
- `PUBLIC_KEY` للتحقق.
- حفظ سجل تحقق لكل عملية فتح رابط تحقق.

---

## 13. إعداد المشروع كاملًا محليًا

### 13.1 تشغيل OCR

```bash
cd python_ocr
python -m venv venv
# Windows
venv\Scripts\activate
# Linux / macOS
source venv/bin/activate
pip install -r requirements.txt
```

أنشئ ملف `.env` داخل `python_ocr`:

```env
ACTIVE_API_KEY=your_gemini_api_key
```

### 13.2 تشغيل Backend

```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan keys:generate-rsa
php artisan serve --host=127.0.0.1 --port=8000
```

إذا كان Laravel يحتاج إلى مسار Python أو OCR:

```env
PYTHON_BINARY=python
OCR_SCRIPT_PATH=../python_ocr/ocr.py
```

على Windows قد تحتاج إلى ضبط:

```env
OPENSSL_CNF_PATH=C:\path\to\openssl.cnf
```

### 13.3 تشغيل React

```bash
cd react
npm install
```

أنشئ ملف `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

ثم:

```bash
npm run dev
```

### 13.4 تشغيل Flutter

```bash
cd flutter_app
flutter pub get
flutter run
```

قبل التشغيل، عدّل `ApiEndpoints.baseUrl` حسب بيئة التشغيل.

---

## 14. أوامر مفيدة

### Laravel

```bash
php artisan migrate:fresh --seed
php artisan config:clear
php artisan cache:clear
php artisan route:list
php artisan queue:work
php artisan test
```

### React

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Flutter

```bash
flutter pub get
flutter run
flutter analyze
flutter build apk
```

### Python OCR

```bash
python ocr.py path/to/image.jpg
```

---

## 15. ملاحظات مهمة للتطوير

- لا يجب رفع ملفات `.env` إلى Git.
- لا يجب رفع `node_modules` أو `vendor` أو `build` أو `.vite` أو مجلدات الكاش.
- عند تغيير رابط API في React يجب إعادة تشغيل Vite.
- عند تغيير رابط API في Flutter يجب إعادة تشغيل التطبيق.
- رابط ngrok يتغير غالبًا عند إعادة تشغيل ngrok، لذلك يجب تحديث React و Flutter عند تغيره.
- خطأ `AxiosError: Network Error` غالبًا يعني أن React لا يستطيع الوصول إلى Backend.
- خطأ `Bad Gateway` مع ngrok غالبًا يعني أن ngrok لا يرى Laravel المحلي أو أن Laravel يعمل على بورت مختلف.
- يجب تشغيل Backend قبل تجربة React أو Flutter.
- يجب ضبط مفتاح Gemini قبل تجربة تسجيل مواطن جديد، لأن التسجيل يستدعي OCR.

---

## 16. ملاحظات للنشر Deployment

قبل النشر الحقيقي يجب:

- تغيير بيانات المدير الافتراضية.
- استخدام قاعدة بيانات حقيقية مثل MySQL أو PostgreSQL.
- ضبط `APP_ENV=production`.
- ضبط `APP_DEBUG=false`.
- استخدام HTTPS.
- إعداد CORS بشكل محدد بدل السماح العام.
- تخزين مفاتيح RSA بشكل آمن.
- إعداد Queue Worker دائم.
- إعداد بريد حقيقي للإشعارات إذا كان مطلوبًا.
- حماية روابط المرفقات والملفات.
- مراقبة سجلات الأخطاء.
- عدم الاعتماد على ngrok في بيئة الإنتاج.
- استخدام Domain ثابت للـ API.

---

## 17. ملاحظات للتسليم الجامعي

هذا المشروع مناسب للتسليم كمشروع متكامل لأنه يوضح:

- فصل واضح بين Backend و Frontend و Mobile و OCR.
- استخدام API حقيقي بين الواجهات والخادم.
- نظام أدوار وصلاحيات.
- Authentication باستخدام Tokens.
- دورة طلب كاملة من المواطن إلى الموظف إلى الوثيقة النهائية.
- دمج OCR مع Backend.
- توليد QR قابل للتحقق.
- استخدام توقيع رقمي RSA.
- وجود لوحات إدارية وإحصائيات وسجلات.
- وجود تطبيق موبايل وواجهة ويب.

للعرض أمام اللجنة، يفضل تنفيذ السيناريو التالي:

1. تشغيل Laravel و OCR.
2. تشغيل React و Flutter.
3. تسجيل مواطن من Flutter مع رفع صورة هوية.
4. إنشاء طلب جديد.
5. الدخول كموظف من React.
6. مراجعة الطلب واعتماده.
7. العودة إلى Flutter وعرض الطلب أو الوثيقة.
8. مسح QR أو فتح رابط التحقق.
9. الدخول كمدير من React وعرض الإحصائيات والسجلات.

---

## 18. أسماء الفريق والمشروع

اسم المشروع: **يَقِين - Yaqeen**

المشرف: **المهندس معاذ طلب**

الفريق:
**سلمان سماق, عبدالرحمن سماق, يوسف الكردي, محمد أنس ناجي, بتول الراعي**

الوصف المختصر:

> منصة رقمية للخدمات الحكومية تدمج بين تطبيق موبايل للمواطن، لوحة ويب للموظف والمدير، Backend آمن بالصلاحيات والتوقيع الرقمي، ومحرك OCR لاستخراج بيانات الهوية.

---

## 19. الترخيص والاستخدام

هذا المشروع مُعد لغرض أكاديمي وتعليمي ضمن مشروع جامعي. أي استخدام إنتاجي حقيقي يحتاج إلى مراجعة أمنية، قانونية، وتشغيلية إضافية، خصوصًا بسبب طبيعة البيانات الشخصية والوثائق الحكومية.
