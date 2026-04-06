import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

// استدعي فقط الشاشة التي تريد رؤيتها (تأكد من المسار)
import 'features/auth/presentation/screens/forgot_password_screen.dart';
import 'features/auth/presentation/screens/login_screen.dart';
import 'features/auth/presentation/screens/register_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(360, 690),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'يقين - YAQEEN',
          locale: const Locale('ar', 'SY'),
          builder: (context, child) {
            return Directionality(
              textDirection: TextDirection.rtl,
              child: child!,
            );
          },
          home: const RegisterScreen(),
        );
      },
    );
  }
}