import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/custom/qr_frame_overlay.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../bloc/qr_bloc.dart';
import '../bloc/qr_event.dart';
import '../bloc/qr_state.dart';
import 'qr_success_screen.dart';
import 'qr_forged_screen.dart';

class QrScanScreen extends StatefulWidget {
  const QrScanScreen({super.key});

  @override
  State<QrScanScreen> createState() => _QrScanScreenState();
}

class _QrScanScreenState extends State<QrScanScreen> {
  final MobileScannerController _scannerController = MobileScannerController();

  bool _isProcessing = false;

  @override
  void dispose() {
    _scannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: BlocConsumer<QrBloc, QrState>(
        listener: (context, state) {
          if (state is QrValid) {
            _scannerController.stop();

            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => QrSuccessScreen(documentData: state.documentData),
              ),
            ).then((_) {
              if (mounted) {
                _isProcessing = false;
                _scannerController.start();
                context.read<QrBloc>().add(ResetQrScannerEvent());
              }
            });
          } else if (state is QrForged) {
            _scannerController.stop();

            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const QrForgedScreen(),
              ),
            ).then((_) {
              if (mounted) {
                _isProcessing = false;
                _scannerController.start();
                context.read<QrBloc>().add(ResetQrScannerEvent());
              }
            });
          } else if (state is QrError) {
            _isProcessing = false;
          }
        },
        builder: (context, state) {
          return Column(
            children: [
              CustomAppBar(
                title: "تحقق من وثيقة",
                subtitle: "وجه الكاميرا نحو كود QR الموجود على الوثيقة",
                backgroundColor: Colors.transparent,
                showFlag: false,
                actions: [
                  ValueListenableBuilder(
                    valueListenable: _scannerController,
                    builder: (context, scannerState, child) {
                      return IconButton(
                        icon: Icon(
                          scannerState.torchState == TorchState.on
                              ? Icons.flash_on_rounded
                              : Icons.flash_off_rounded,
                          color: AppColors.white,
                          size: 22.sp,
                        ),
                        onPressed: () => _scannerController.toggleTorch(),
                      );
                    },
                  ),
                  IconButton(
                    icon: Icon(Icons.close, color: AppColors.white, size: 24.sp),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),

              Expanded(
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    MobileScanner(
                      controller: _scannerController,
                      onDetect: (capture) {
                        if (_isProcessing) return;

                        final List<Barcode> barcodes = capture.barcodes;
                        if (barcodes.isNotEmpty && barcodes.first.rawValue != null) {
                          setState(() {
                            _isProcessing = true;
                          });

                          final String rawValue = barcodes.first.rawValue!;

                          context.read<QrBloc>().add(VerifyScannedQrEvent(rawValue));
                        }
                      },
                    ),

                    QrFrameOverlay(size: 220.w),

                    if (state is QrVerifying)
                      Container(
                        color: AppColors.black.withOpacity(0.6),
                        child: const Center(
                          child: CircularProgressIndicator(color: AppColors.green),
                        ),
                      ),

                    Positioned(
                      bottom: 80.h,
                      child: Container(
                        padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 12.h),
                        decoration: BoxDecoration(
                          color: AppColors.black.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(20.r),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.security_rounded, color: AppColors.green, size: 16.sp),
                            SizedBox(width: 8.w),
                            Text(
                              "التحقق يتم محلياً وآمناً",
                              style: AppTextStyles.captionSemiBold.copyWith(color: AppColors.white, fontSize: 10.sp),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}