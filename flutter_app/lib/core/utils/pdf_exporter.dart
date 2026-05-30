import 'package:flutter/services.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../../features/citizen/data/models/request_model.dart';
import '../constants/app_assets.dart';

class PdfExporter {
  static Future<void> exportRequestToPdf(RequestModel request) async {
    final pdf = pw.Document();

    final arabicFont = await PdfGoogleFonts.cairoRegular();
    final arabicFontBold = await PdfGoogleFonts.cairoBold();

    final ByteData flagData = await rootBundle.load(AppAssets.syriaFlag);
    final ByteData eagleData = await rootBundle.load(AppAssets.syriaEagle);

    final flagImage = pw.MemoryImage(flagData.buffer.asUint8List());
    final eagleImage = pw.MemoryImage(eagleData.buffer.asUint8List());

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        textDirection: pw.TextDirection.rtl,
        theme: pw.ThemeData.withFont(
          base: arabicFont,
          bold: arabicFontBold,
        ),
        build: (pw.Context context) {
          return pw.Container(
            padding: const pw.EdgeInsets.all(24),
            decoration: pw.BoxDecoration(
              border: pw.Border.all(color: PdfColors.green900, width: 2),
            ),
            child: pw.Stack(
              children: [
                pw.Positioned.fill(
                  child: pw.Center(
                    child: pw.Opacity(
                      opacity: 0.1,
                      child: pw.Image(eagleImage, width: 350),
                    ),
                  ),
                ),

                pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Row(
                      mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: pw.CrossAxisAlignment.center,
                      children: [
                        pw.Image(flagImage, width: 60, height: 60),

                        pw.Column(
                          children: [
                            pw.Text(
                              'الجمهورية العربية السورية',
                              style: pw.TextStyle(fontSize: 16, fontWeight: pw.FontWeight.bold),
                            ),
                            pw.SizedBox(height: 4),
                            pw.Text(
                              'بوابة الخدمات الإلكترونية - يقين',
                              style: const pw.TextStyle(fontSize: 14, color: PdfColors.grey700),
                            ),
                          ],
                        ),

                        pw.Image(eagleImage, width: 150, height: 150),
                      ],
                    ),
                    pw.SizedBox(height: 30),

                    pw.Center(
                      child: pw.Text(
                        request.title,
                        style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold, color: PdfColors.green900),
                      ),
                    ),
                    pw.SizedBox(height: 30),

                    _buildPdfRow('رقم الطلب:', request.requestNumber ?? 'غير متوفر'),
                    _buildPdfRow('تاريخ الإصدار:', request.date),
                    pw.Divider(color: PdfColors.grey400),
                    pw.SizedBox(height: 10),

                    _buildPdfRow('الاسم الكامل:', request.fullName ?? 'غير متوفر'),
                    _buildPdfRow('الرقم الوطني:', request.nationalId ?? 'غير متوفر'),
                    _buildPdfRow('مكان القيد:', request.registrationPlace ?? 'غير متوفر'),
                    pw.SizedBox(height: 30),

                    if (request.qrUrl != null) ...[
                      pw.Center(
                        child: pw.Text(
                          'رمز التحقق الإلكتروني',
                          style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold),
                        ),
                      ),
                      pw.SizedBox(height: 10),
                      pw.Center(
                        child: pw.BarcodeWidget(
                          barcode: pw.Barcode.qrCode(),
                          data: request.qrUrl!,
                          width: 120,
                          height: 120,
                        ),
                      ),
                      pw.SizedBox(height: 10),
                      pw.Center(
                        child: pw.Text(
                          'امسح الرمز للتحقق من صحة هذه الوثيقة',
                          style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey600),
                        ),
                      ),
                    ],

                    pw.Spacer(),
                    pw.Center(
                      child: pw.Text(
                        'هذه وثيقة إلكترونية مستخرجة من تطبيق يقين ولا تحتاج لتوقيع حي.',
                        style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdf.save(),
      name: 'Yaqeen_Document_${request.requestNumber ?? '1'}.pdf',
    );
  }

  static pw.Widget _buildPdfRow(String label, String value) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 6),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
          pw.Text(label, style: const pw.TextStyle(fontSize: 14, color: PdfColors.grey800)),
          pw.Text(value, style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
        ],
      ),
    );
  }
}