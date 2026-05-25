@extends('emails.layout')

@section('content')

    {{-- Status Banner --}}
    <div class="status-banner received" style="display:flex; align-items:center; gap:14px;">
        <div class="status-icon received">📥</div>
        <div class="status-text received">
            <h2>تم استلام طلبك بنجاح</h2>
            <p>سيتم مراجعته من قِبل الموظف المختص</p>
        </div>
    </div>

    {{-- Body --}}
    <div class="email-body">

        <p class="greeting">مرحباً {{ $citizenName }}،</p>

        <p class="intro-text">
            تم استلام طلبك وتسجيله في النظام بنجاح. سيتم مراجعته من قِبل
            الموظف المختص وستصلك رسالة إشعار فور اتخاذ القرار.
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
                <span class="info-label">تاريخ التقديم</span>
                <span class="info-value">{{ $submittedAt }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">الحالة</span>
                <span class="info-value" style="color:#d97706; font-weight:700;">⏳ قيد المراجعة</span>
            </div>
        </div>

        <p style="color:#4a5568; font-size:14px; margin-bottom:24px;">
            يمكنك متابعة حالة طلبك في أي وقت من خلال قسم
            <strong>"طلباتي"</strong> في التطبيق.
        </p>

        <div class="cta-wrapper">
            <a href="{{ $appUrl }}" class="cta-button received">متابعة الطلب</a>
        </div>

    </div>

@endsection
