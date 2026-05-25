@extends('emails.layout')

@section('content')

    {{-- Status Banner --}}
    <div class="status-banner approved" style="display:flex; align-items:center; gap:14px;">
        <div class="status-icon approved">✅</div>
        <div class="status-text approved">
            <h2>تمت الموافقة على طلبك</h2>
            <p>وثيقتك جاهزة للتصدير الآن</p>
        </div>
    </div>

    {{-- Body --}}
    <div class="email-body">

        <p class="greeting">مرحباً {{ $citizenName }}،</p>

        <p class="intro-text">
            يسعدنا إبلاغك بأن طلبك قد تمت مراجعته واعتماده من قِبل الموظف المختص.
            يمكنك الآن فتح تطبيق <strong>يقين</strong> وتصدير وثيقتك رسمياً بصيغة PDF.
        </p>

        {{-- Info Card --}}
        <div class="info-card">
            <div class="info-card-title">تفاصيل الطلب</div>

            <div class="info-row">
                <span class="info-label">رقم الطلب</span>
                <span class="info-value request-number">{{ $requestNumber }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">نوع الخدمة</span>
                <span class="info-value">{{ $serviceName }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">تاريخ الاعتماد</span>
                <span class="info-value">{{ $resolvedAt }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">اعتمد بواسطة</span>
                <span class="info-value">{{ $employeeName }}</span>
            </div>
        </div>

        <p style="color:#4a5568; margin-bottom:8px; font-size:14px;">
            📱 لتحميل وثيقتك افتح التطبيق واذهب إلى <strong>أرشيفي الشخصي</strong> واضغط على "تصدير PDF".
        </p>

        <div class="cta-wrapper">
            <a href="{{ $appUrl }}" class="cta-button approved">فتح التطبيق</a>
        </div>

    </div>

@endsection
