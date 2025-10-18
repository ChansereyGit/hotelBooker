import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:sizer/sizer.dart';
import 'package:intl/intl.dart';

import '../../core/app_export.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/custom_icon_widget.dart';
import '../../models/hotel.dart';
import '../../models/room.dart';
import '../../models/booking.dart';
import '../../services/booking_service.dart';
import '../../services/auth_service.dart';
import './widgets/booking_summary_card.dart';
import './widgets/guest_information_section.dart';
import './widgets/payment_section.dart';
import './widgets/progress_indicator_widget.dart';

class BookingCheckout extends StatefulWidget {
  const BookingCheckout({super.key});

  @override
  State<BookingCheckout> createState() => _BookingCheckoutState();
}

class _BookingCheckoutState extends State<BookingCheckout> {
  final ScrollController _scrollController = ScrollController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final BookingService _bookingService = BookingService();
  final AuthService _authService = AuthService();

  int _currentStep = 0;
  bool _isLoading = false;
  bool _isProcessingPayment = false;

  final List<String> _steps = ['Guest Info', 'Payment', 'Confirmation'];
  
  // Data from navigation
  Hotel? _hotel;
  Room? _room;
  DateTime? _checkInDate;
  DateTime? _checkOutDate;
  int _guests = 2;
  int _numberOfRooms = 1;
  int _nights = 1;
  double _totalPrice = 0;

  // Mock booking data
  final Map<String, dynamic> _bookingData = {
    'hotelName': 'Grand Plaza Hotel & Spa',
    'location': 'Downtown Manhattan, New York',
    'rating': 4.8,
    'checkInDate': 'Dec 15, 2024',
    'checkOutDate': 'Dec 18, 2024',
    'roomType': 'Deluxe King Room',
    'guests': 2,
    'roomRate': '\$897.00',
    'taxesFees': '\$134.55',
    'totalAmount': '\$1,031.55',
    'nights': 3,
  };

  // Guest information data
  Map<String, dynamic> _guestData = {
    'firstName': 'John',
    'lastName': 'Smith',
    'email': 'john.smith@email.com',
    'phone': '5551234567',
    'countryCode': '+1',
    'specialRequests': '',
  };

  // Payment data
  Map<String, dynamic> _paymentData = {
    'paymentMethod': 'card',
    'cardNumber': '',
    'expiry': '',
    'cvv': '',
    'cardHolder': '',
    'billingAddress': '',
    'city': '',
    'zip': '',
    'sameAsBilling': true,
    'acceptTerms': false,
  };

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadDataFromArguments();
    });
  }
  
  void _loadDataFromArguments() {
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    
    if (args != null) {
      setState(() {
        _hotel = args['hotel'] as Hotel?;
        _room = args['room'] as Room?;
        _checkInDate = args['checkInDate'] as DateTime?;
        _checkOutDate = args['checkOutDate'] as DateTime?;
        _guests = args['guests'] as int? ?? 2;
        _numberOfRooms = args['numberOfRooms'] as int? ?? 1;
        _nights = args['nights'] as int? ?? 1;
        _totalPrice = args['totalPrice'] as double? ?? 0;
      });
      
      // Pre-fill guest data from logged-in user
      _loadUserData();
    }
  }
  
  Future<void> _loadUserData() async {
    final user = await _authService.getCurrentUser();
    if (user != null) {
      setState(() {
        final nameParts = user.fullName.split(' ');
        _guestData['firstName'] = nameParts.isNotEmpty ? nameParts[0] : '';
        _guestData['lastName'] = nameParts.length > 1 ? nameParts.sublist(1).join(' ') : '';
        _guestData['email'] = user.email;
        if (user.phoneNumber != null) {
          _guestData['phone'] = user.phoneNumber;
        }
      });
    }
  }
  
  Map<String, dynamic> _getBookingData() {
    final roomRate = _room != null 
        ? _room!.pricePerNight * _nights * _numberOfRooms
        : _totalPrice;
    final taxesFees = roomRate * 0.15; // 15% tax
    final total = roomRate + taxesFees;
    
    return {
      'hotelName': _hotel?.name ?? 'Hotel',
      'location': _hotel != null ? '${_hotel!.city}, ${_hotel!.country}' : 'Location',
      'rating': _hotel?.guestRating ?? 0,
      'checkInDate': _checkInDate != null 
          ? DateFormat('MMM dd, yyyy').format(_checkInDate!)
          : 'Not set',
      'checkOutDate': _checkOutDate != null 
          ? DateFormat('MMM dd, yyyy').format(_checkOutDate!)
          : 'Not set',
      'roomType': _room?.roomType ?? 'Room',
      'guests': _guests,
      'roomRate': '\$${roomRate.toStringAsFixed(2)}',
      'taxesFees': '\$${taxesFees.toStringAsFixed(2)}',
      'totalAmount': '\$${total.toStringAsFixed(2)}',
      'nights': _nights,
    };
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onGuestDataChanged(Map<String, dynamic> data) {
    setState(() {
      _guestData = data;
    });
  }

  void _onPaymentDataChanged(Map<String, dynamic> data) {
    setState(() {
      _paymentData = data;
    });
  }

  void _nextStep() {
    if (_currentStep < _steps.length - 1) {
      setState(() {
        _currentStep++;
      });
      _scrollToTop();
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
      });
      _scrollToTop();
    }
  }

  void _scrollToTop() {
    _scrollController.animateTo(
      0,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  Future<void> _processBooking() async {
    if (!_validateCurrentStep()) {
      _showErrorToast('Please fill in all required fields');
      return;
    }
    
    if (_hotel == null || _room == null || _checkInDate == null || _checkOutDate == null) {
      _showErrorToast('Missing booking information');
      return;
    }

    setState(() {
      _isProcessingPayment = true;
    });

    try {
      // Get current user
      final user = await _authService.getCurrentUser();
      if (user == null) {
        _showErrorToast('Please login to complete booking');
        setState(() => _isProcessingPayment = false);
        return;
      }
      
      // Create booking object
      final booking = Booking(
        userId: user.id,
        hotelId: _hotel!.id,
        hotelName: _hotel!.name,
        roomId: _room!.id,
        roomType: _room!.roomType,
        checkInDate: DateFormat('yyyy-MM-dd').format(_checkInDate!),
        checkOutDate: DateFormat('yyyy-MM-dd').format(_checkOutDate!),
        numberOfGuests: _guests,
        numberOfRooms: _numberOfRooms,
        numberOfNights: _nights,
        totalPrice: _totalPrice,
        status: 'CONFIRMED',
        specialRequests: _guestData['specialRequests'] as String?,
        guestName: '${_guestData['firstName']} ${_guestData['lastName']}',
        guestEmail: _guestData['email'] as String,
        guestPhone: '${_guestData['countryCode']}${_guestData['phone']}',
      );
      
      // Submit booking to backend
      final result = await _bookingService.createBooking(booking);
      
      if (result['success']) {
        final createdBooking = result['booking'] as Booking;
        _showSuccessDialog(createdBooking.id ?? 'N/A');
      } else {
        _showPaymentErrorDialog(result['message'] ?? 'Booking failed');
      }
    } catch (e) {
      _showErrorToast('Payment processing failed: ${e.toString()}');
    } finally {
      setState(() {
        _isProcessingPayment = false;
      });
    }
  }

  bool _validateCurrentStep() {
    switch (_currentStep) {
      case 0:
        return _guestData['firstName']?.isNotEmpty == true &&
            _guestData['lastName']?.isNotEmpty == true &&
            _guestData['email']?.isNotEmpty == true &&
            _guestData['phone']?.isNotEmpty == true;
      case 1:
        return _paymentData['acceptTerms'] == true &&
            (_paymentData['paymentMethod'] != 'card' ||
                (_paymentData['cardNumber']?.replaceAll(' ', '').length == 16 &&
                    _paymentData['expiry']?.length == 5 &&
                    _paymentData['cvv']?.length >= 3 &&
                    _paymentData['cardHolder']?.isNotEmpty == true));
      default:
        return true;
    }
  }

  void _showSuccessDialog(String bookingId) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Column(
          children: [
            Container(
              width: 15.w,
              height: 15.w,
              decoration: BoxDecoration(
                color: Theme.of(context)
                    .colorScheme
                    .primary
                    .withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: CustomIconWidget(
                iconName: 'check_circle',
                color: Theme.of(context).colorScheme.primary,
                size: 32,
              ),
            ),
            SizedBox(height: 2.h),
            Text(
              'Booking Confirmed!',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Your reservation has been successfully confirmed. A confirmation email has been sent to ${_guestData['email']}.',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
            SizedBox(height: 2.h),
            Container(
              padding: EdgeInsets.all(3.w),
              decoration: BoxDecoration(
                color: Theme.of(context)
                    .colorScheme
                    .surfaceContainerHighest
                    .withValues(alpha: 0.5),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  Text(
                    'Booking Reference',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                  SizedBox(height: 0.5.h),
                  Text(
                    bookingId,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/hotel-search-home',
                (route) => false,
              );
            },
            child: const Text('View Bookings'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/hotel-search-home',
                (route) => false,
              );
            },
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }

  void _showPaymentErrorDialog(String errorMessage) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Column(
          children: [
            Container(
              width: 15.w,
              height: 15.w,
              decoration: BoxDecoration(
                color:
                    Theme.of(context).colorScheme.error.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: CustomIconWidget(
                iconName: 'error',
                color: Theme.of(context).colorScheme.error,
                size: 32,
              ),
            ),
            SizedBox(height: 2.h),
            Text(
              'Booking Failed',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
            ),
          ],
        ),
        content: Text(
          errorMessage,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _processBooking();
            },
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }

  void _showErrorToast(String message) {
    Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
      backgroundColor: Theme.of(context).colorScheme.error,
      textColor: Theme.of(context).colorScheme.onError,
    );
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return GuestInformationSection(
          guestData: _guestData,
          onGuestDataChanged: _onGuestDataChanged,
        );
      case 1:
        return PaymentSection(
          paymentData: _paymentData,
          onPaymentDataChanged: _onPaymentDataChanged,
        );
      case 2:
        return _buildConfirmationStep();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildConfirmationStep() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      margin: EdgeInsets.symmetric(horizontal: 4.w),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: colorScheme.shadow.withValues(alpha: 0.08),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(4.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CustomIconWidget(
                  iconName: 'check_circle_outline',
                  color: colorScheme.primary,
                  size: 24,
                ),
                SizedBox(width: 2.w),
                Text(
                  'Review & Confirm',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: colorScheme.onSurface,
                  ),
                ),
              ],
            ),
            SizedBox(height: 3.h),

            // Guest Summary
            Container(
              padding: EdgeInsets.all(3.w),
              decoration: BoxDecoration(
                color:
                    colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Guest Information',
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: colorScheme.onSurface,
                    ),
                  ),
                  SizedBox(height: 1.h),
                  Text(
                    '${_guestData['firstName']} ${_guestData['lastName']}',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: colorScheme.onSurface,
                    ),
                  ),
                  Text(
                    _guestData['email'] as String,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                  Text(
                    '${_guestData['countryCode']} ${_guestData['phone']}',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: 2.h),

            // Payment Summary
            Container(
              padding: EdgeInsets.all(3.w),
              decoration: BoxDecoration(
                color:
                    colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Payment Method',
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: colorScheme.onSurface,
                    ),
                  ),
                  SizedBox(height: 1.h),
                  Row(
                    children: [
                      CustomIconWidget(
                        iconName: _paymentData['paymentMethod'] == 'card'
                            ? 'credit_card'
                            : _paymentData['paymentMethod'] == 'apple_pay'
                                ? 'apple'
                                : _paymentData['paymentMethod'] == 'google_pay'
                                    ? 'google'
                                    : 'payment',
                        color: colorScheme.onSurfaceVariant,
                        size: 20,
                      ),
                      SizedBox(width: 2.w),
                      Text(
                        _paymentData['paymentMethod'] == 'card'
                            ? 'Credit Card ending in ${_paymentData['cardNumber']?.replaceAll(' ', '').substring(12) ?? '****'}'
                            : _paymentData['paymentMethod'] == 'apple_pay'
                                ? 'Apple Pay'
                                : _paymentData['paymentMethod'] == 'google_pay'
                                    ? 'Google Pay'
                                    : 'PayPal',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: colorScheme.onSurface,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            SizedBox(height: 3.h),

            // Important Notice
            Container(
              padding: EdgeInsets.all(3.w),
              decoration: BoxDecoration(
                color: colorScheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: colorScheme.primary.withValues(alpha: 0.3),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CustomIconWidget(
                        iconName: 'info',
                        color: colorScheme.primary,
                        size: 20,
                      ),
                      SizedBox(width: 2.w),
                      Text(
                        'Important Information',
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w600,
                          color: colorScheme.primary,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 1.h),
                  Text(
                    '• Check-in time: 3:00 PM\n• Check-out time: 11:00 AM\n• Cancellation policy: Free cancellation until 24 hours before check-in\n• A valid ID and credit card are required at check-in',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: colorScheme.onSurface,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomActionBar() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: colorScheme.shadow.withValues(alpha: 0.12),
            blurRadius: 12,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(4.w),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (_currentStep < 2) ...[
                Row(
                  children: [
                    if (_currentStep > 0) ...[
                      Expanded(
                        child: OutlinedButton(
                          onPressed: _previousStep,
                          style: OutlinedButton.styleFrom(
                            padding: EdgeInsets.symmetric(vertical: 3.h),
                          ),
                          child: Text(
                            'Back',
                            style: theme.textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                      SizedBox(width: 3.w),
                    ],
                    Expanded(
                      flex: _currentStep > 0 ? 2 : 1,
                      child: ElevatedButton(
                        onPressed: _validateCurrentStep() ? _nextStep : null,
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.symmetric(vertical: 3.h),
                          backgroundColor: colorScheme.primary,
                          foregroundColor: colorScheme.onPrimary,
                        ),
                        child: Text(
                          _currentStep == 0
                              ? 'Continue to Payment'
                              : 'Review Booking',
                          style: theme.textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ] else ...[
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _isProcessingPayment ? null : _previousStep,
                        style: OutlinedButton.styleFrom(
                          padding: EdgeInsets.symmetric(vertical: 3.h),
                        ),
                        child: Text(
                          'Back',
                          style: theme.textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: 3.w),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed:
                            _isProcessingPayment ? null : _processBooking,
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.symmetric(vertical: 3.h),
                          backgroundColor: colorScheme.primary,
                          foregroundColor: colorScheme.onPrimary,
                        ),
                        child: _isProcessingPayment
                            ? Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  SizedBox(
                                    width: 5.w,
                                    height: 5.w,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                        colorScheme.onPrimary,
                                      ),
                                    ),
                                  ),
                                  SizedBox(width: 2.w),
                                  Text(
                                    'Processing...',
                                    style: theme.textTheme.titleSmall?.copyWith(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              )
                            : Text(
                                'Complete Booking',
                                style: theme.textTheme.titleSmall?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      backgroundColor: colorScheme.surfaceContainerLowest,
      appBar: CustomAppBar(
        title: 'Booking Checkout',
        variant: CustomAppBarVariant.booking,
        onBackPressed: () {
          if (_currentStep > 0) {
            _previousStep();
          } else {
            Navigator.pop(context);
          }
        },
      ),
      body: Column(
        children: [
          ProgressIndicatorWidget(
            currentStep: _currentStep,
            steps: _steps,
          ),
          Expanded(
            child: SingleChildScrollView(
              controller: _scrollController,
              physics: const BouncingScrollPhysics(),
              child: Column(
                children: [
                  SizedBox(height: 2.h),

                  // Booking Summary (always visible)
                  BookingSummaryCard(bookingData: _getBookingData()),

                  SizedBox(height: 2.h),

                  // Step Content
                  _buildStepContent(),

                  SizedBox(height: 10.h), // Space for bottom action bar
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomActionBar(),
    );
  }
}
