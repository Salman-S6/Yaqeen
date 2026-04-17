import 'package:flutter/material.dart';
import 'citizen_home_screen.dart';
import 'requests_list_screen.dart';
import 'settings_screen.dart';
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
    const SizedBox(),
    const SettingsScreen(),
  ];

  void _onItemTapped(int index) {
    if (index == 2) {
      Navigator.pushNamed(context, '/qr_scan');
    }
    else {
      setState(() {
        _currentIndex = index;
      });
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