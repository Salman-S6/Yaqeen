import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'features/auth/data/repositories/auth_repository.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/auth/presentation/screens/forgot_password_screen.dart';
import 'features/auth/presentation/screens/login_screen.dart';
import 'features/auth/presentation/screens/register_screen.dart';
import 'features/citizen/presentation/screens/citizen_home_screen.dart';
import 'features/qr_verification/presentation/screens/qr_scan_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
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

        return MultiRepositoryProvider(
          providers: [
            RepositoryProvider(create: (context) => AuthRepository()),
          ],

          child: MultiBlocProvider(
            providers: [
              BlocProvider(
                create: (context) => AuthBloc(
                  authRepository: context.read<AuthRepository>(),
                ),
              ),
            ],

            child: MaterialApp(
              debugShowCheckedModeBanner: false,
              title: 'يقين - YAQEEN',
              locale: const Locale('ar', 'SY'),

              builder: (context, child) {
                return Directionality(
                  textDirection: TextDirection.rtl,
                  child: child!,
                );
              },

              initialRoute: '/login',
              routes: {
                '/login': (context) => const LoginScreen(),
                '/register': (context) => const RegisterScreen(),
                '/forgot_password': (context) => const ForgotPasswordScreen(),
                 '/citizen_home': (context) => const CitizenHomeScreen(),
                 '/qr_scan': (context) => const QrScanScreen(),
              },
            ),
          ),
        );
      },
    );
  }
}