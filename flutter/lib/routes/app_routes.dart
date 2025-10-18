import 'package:flutter/material.dart';
import '../presentation/booking_checkout/booking_checkout.dart';
import '../presentation/hotel_search_home/hotel_search_home.dart';
import '../presentation/login_screen/login_screen.dart';
import '../presentation/hotel_search_results/hotel_search_results.dart';
import '../presentation/hotel_detail/hotel_detail.dart';
import '../presentation/room_selection/room_selection.dart';

class AppRoutes {
  // TODO: Add your routes here
  static const String initial = '/';
  static const String bookingCheckout = '/booking-checkout';
  static const String hotelSearchHome = '/hotel-search-home';
  static const String login = '/login-screen';
  static const String hotelSearchResults = '/hotel-search-results';
  static const String hotelDetail = '/hotel-detail';
  static const String roomSelection = '/room-selection';

  static Map<String, WidgetBuilder> routes = {
    initial: (context) => const LoginScreen(),
    bookingCheckout: (context) => const BookingCheckout(),
    hotelSearchHome: (context) => const HotelSearchHome(),
    login: (context) => const LoginScreen(),
    hotelSearchResults: (context) => const HotelSearchResults(),
    hotelDetail: (context) => const HotelDetail(),
    roomSelection: (context) => const RoomSelection(),
    // TODO: Add your other routes here
  };
}
