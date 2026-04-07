import 'package:flutter/material.dart';

// استدعاء الشاشات وشريط التنقل
import 'citizen_home_screen.dart';
import 'requests_list_screen.dart';
import '../../../../core/widgets/navigation/custom_bottom_nav.dart';

class MainLayoutScreen extends StatefulWidget {
  const MainLayoutScreen({super.key});

  @override
  State<MainLayoutScreen> createState() => _MainLayoutScreenState();
}

class _MainLayoutScreenState extends State<MainLayoutScreen> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const CitizenHomeScreen(),
    const RequestsListScreen(),
  ];

  void _onItemTapped(int index) {
    if (index == 0 || index == 1) {
      setState(() {
        _currentIndex = index;
      });
    } else if (index == 2) {
      Navigator.pushNamed(context, '/new_request');
    } else if (index == 3) {
      Navigator.pushNamed(context, '/qr_scan');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _tabs,
      ),
      bottomNavigationBar: CustomBottomNav(
        currentIndex: _currentIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}