@extends('emails.layout')

@section('content')

    {{-- Status Banner --}}
    <div class="status-banner rejected" style="display:flex; align-items:center; gap:14px;">
        <div class="status-icon rejected">❌</div>
        <div class="status-text rejected">
            <h2>تم رفض طلبك</h2>
            <p>يرجى مراجعة سبب الرفض وتقديم طلب جديد</p>
        </div>
    </div>

    {{-- Body --}}
    <div class="email-body">

        <p class="greeting">مرحباً {{ $citizenName }}،</p>

        <p class="intro-text">
            نأسف لإبلاغك بأنه لم يتمكن الموظف المختص من اعتماد طلبك بسبب وجود ملاحظة تستدعي التصحيح.
            يرجى الاطلاع على سبب الرفض أدناه.
        </p>

        {{-- Rejection Reason --}}
        <div class="reason-box">
            <div class="reason-box-title">📋 سبب الرفض</div>
            <p>{{ $reason }}</p>
        </div>

        {{-- Info Card --}}
        <div class="info-card">
            <div class="info-card-title">تفاصيل الطلب المرفوض</div>

            <div class="info-row">
                <span class="info-label">رقم الطلب</span>
                <span class="info-value request-number">{{ $requestNumber }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">نوع الخدمة</span>
                <span class="info-value">{{ $serviceName }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">تاريخ الرفض</span>
                <span class="info-value">{{ $resolvedAt }}</span>
            </div>
        </div>

        <p style="color:#4a5568; font-size:14px; margin-bottom:24px;">
            بإمكانك تقديم طلب جديد بعد تصحيح المشكلة المذكورة.
            إذا كنت تعتقد أن الرفض خاطئ يمكنك التواصل مع الدعم.
        </p>

        <div class="cta-wrapper">
            <a href="{{ $appUrl }}" class="cta-button rejected">تقديم طلب جديد</a>
        </div>

    </div>

@endsection
