<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>{{ $subject ?? 'إشعار من منصة يقين' }}</title>
    <style>
        /* ===== Reset ===== */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0; mso-table-rspace: 0; }
        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }

        /* ===== Base ===== */
        body {
            background-color: #f4f6f9;
            font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
            font-size: 15px;
            line-height: 1.7;
            color: #2d3748;
            direction: rtl;
        }

        /* ===== Wrapper ===== */
        .email-wrapper {
            width: 100%;
            background-color: #f4f6f9;
            padding: 40px 20px;
        }

        /* ===== Container ===== */
        .email-container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }

        /* ===== Header ===== */
        .email-header {
            background: linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%);
            padding: 32px 40px;
            text-align: center;
        }
        .email-header .logo-text {
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.5px;
        }
        .email-header .logo-sub {
            font-size: 12px;
            color: rgba(255,255,255,0.7);
            margin-top: 4px;
            letter-spacing: 0.5px;
        }

        /* ===== Status Banner ===== */
        .status-banner {
            padding: 20px 40px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .status-banner.approved { background-color: #f0fff4; border-bottom: 3px solid #38a169; }
        .status-banner.rejected { background-color: #fff5f5; border-bottom: 3px solid #e53e3e; }
        .status-banner.received { background-color: #ebf8ff; border-bottom: 3px solid #3182ce; }

        .status-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            flex-shrink: 0;
        }
        .status-icon.approved { background-color: #c6f6d5; }
        .status-icon.rejected { background-color: #fed7d7; }
        .status-icon.received { background-color: #bee3f8; }

        .status-text h2 {
            font-size: 18px;
            font-weight: 700;
        }
        .status-text.approved h2 { color: #276749; }
        .status-text.rejected h2 { color: #9b2c2c; }
        .status-text.received h2 { color: #2c5282; }

        .status-text p {
            font-size: 13px;
            color: #718096;
            margin-top: 2px;
        }

        /* ===== Body ===== */
        .email-body {
            padding: 32px 40px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 16px;
        }
        .intro-text {
            color: #4a5568;
            margin-bottom: 24px;
        }

        /* ===== Info Card ===== */
        .info-card {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px 24px;
            margin-bottom: 24px;
        }
        .info-card-title {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #a0aec0;
            margin-bottom: 14px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #edf2f7;
        }
        .info-row:last-child { border-bottom: none; }
        .info-label {
            font-size: 13px;
            color: #718096;
        }
        .info-value {
            font-size: 13px;
            font-weight: 600;
            color: #2d3748;
            direction: ltr;
            text-align: left;
        }
        .info-value.request-number {
            font-family: 'Courier New', monospace;
            background-color: #edf2f7;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
        }

        /* ===== Reason Box ===== */
        .reason-box {
            background-color: #fff5f5;
            border: 1px solid #fed7d7;
            border-right: 4px solid #e53e3e;
            border-radius: 6px;
            padding: 16px 20px;
            margin-bottom: 24px;
        }
        .reason-box-title {
            font-size: 13px;
            font-weight: 700;
            color: #c53030;
            margin-bottom: 8px;
        }
        .reason-box p {
            font-size: 14px;
            color: #742a2a;
            line-height: 1.6;
        }

        /* ===== CTA Button ===== */
        .cta-wrapper {
            text-align: center;
            margin: 28px 0;
        }
        .cta-button {
            display: inline-block;
            padding: 13px 36px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            letter-spacing: 0.3px;
        }
        .cta-button.approved {
            background: linear-gradient(135deg, #276749, #38a169);
            color: #ffffff;
        }
        .cta-button.rejected {
            background: linear-gradient(135deg, #2b6cb0, #3182ce);
            color: #ffffff;
        }
        .cta-button.received {
            background: linear-gradient(135deg, #2b6cb0, #3182ce);
            color: #ffffff;
        }

        /* ===== Footer ===== */
        .email-footer {
            background-color: #f7fafc;
            border-top: 1px solid #e2e8f0;
            padding: 24px 40px;
            text-align: center;
        }
        .footer-text {
            font-size: 12px;
            color: #a0aec0;
            line-height: 1.7;
        }
        .footer-text a {
            color: #3182ce;
            text-decoration: none;
        }
        .footer-divider {
            margin: 0 6px;
            color: #e2e8f0;
        }

        /* ===== Responsive ===== */
        @media only screen and (max-width: 600px) {
            .email-header, .email-body, .email-footer { padding-left: 24px !important; padding-right: 24px !important; }
            .status-banner { padding: 16px 24px !important; }
            .info-row { flex-direction: column; align-items: flex-start; gap: 2px; }
        }
    </style>
</head>
<body>
<div class="email-wrapper">
    <div class="email-container">

        {{-- Header --}}
        <div class="email-header">
            <div class="logo-text">⚖️ يقين</div>
            <div class="logo-sub">منصة الخدمات الحكومية الرقمية</div>
        </div>

        {{-- Dynamic content from child views --}}
        @yield('content')

        {{-- Footer --}}
        <div class="email-footer">
            <p class="footer-text">
                هذا بريد إلكتروني آلي — يُرجى عدم الرد عليه
                <span class="footer-divider">|</span>
                <a href="#">سياسة الخصوصية</a>
                <span class="footer-divider">|</span>
                <a href="#">التواصل مع الدعم</a>
            </p>
            <p class="footer-text" style="margin-top: 8px;">
                © {{ date('Y') }} منصة يقين — جميع الحقوق محفوظة
            </p>
        </div>

    </div>
</div>
</body>
</html>
