# Comprehensive Project Proposal: Restaurant Point of Sale (POS) System

## 1. Introduction: What Are We Building?
We are building a complete software system to run a restaurant's billing and management operations. This system consists of two main parts:
1. **The POS App (The Front Desk):** An app installed on a tablet or computer at the billing counter. This is what the cashier uses to take orders, print bills, and collect payments. We will build this using a technology called **Flutter**, which ensures the app is fast, modern, and works smoothly.
2. **The Admin Dashboard (The Back Office):** A secure website where the restaurant owner or manager can log in from anywhere in the world to see live sales, add new food items to the menu, and see business reports. This is powered by a technology called **Node.js**.

---

## 2. The Daily Workflow: How It All Works Together
To understand the system, let's walk through a typical customer order:

1. **Customer Orders:** A customer walks in and orders a Coffee and some Momos.
2. **Punching the Order:** The Cashier taps "Beverages" -> "Coffee" and "Snacks" -> "Momos" on the POS App tablet.
3. **Generating the Bill:** The app instantly calculates the total, adding any necessary taxes.
4. **Payment & Printing:** The Cashier selects how the customer is paying (Cash, Card, or Paytm) and taps "Bill". The connected receipt printer immediately prints the bill.
5. **Live Update:** The moment the bill is printed, the data is sent securely over the internet to the Admin Dashboard.
6. **Owner's View:** The restaurant owner, sitting at home, can open their Admin Dashboard and instantly see that a Coffee and Momos were just sold.

---

## 3. User Roles: Who Can Do What?
Security is crucial. We divide access into three distinct roles so that staff members only see what they are supposed to see.

### Role 1: The Super Admin (The Owner)
* **Who they are:** The owner or top-level management.
* **What they can do:** They have "God Mode." They can see every report, change any setting, and view total profit and loss. They are the only ones who can add or remove Managers and Cashiers from the system.
* **Why it matters:** Ensures complete control and prevents unauthorized people from viewing sensitive financial data.

### Role 2: The Manager
* **Who they are:** The person running the day-to-day operations at the restaurant.
* **What they can do:** They can add new items to the menu, change prices if ingredients get expensive, and create discount coupons. Crucially, if a Cashier needs to give a customer a refund or mark an item as "Non-Chargeable" (free), the Manager must authorize it.
* **Why it matters:** Gives enough power to run the restaurant smoothly without exposing the highest-level financial reports.

### Role 3: The Cashier / Staff
* **Who they are:** The person standing at the billing counter.
* **What they can do:** They only have access to the billing screen. They can take orders, apply valid coupons, accept payments, and print bills.
* **What they CANNOT do:** They cannot change food prices, they cannot view total monthly sales, and they cannot delete a bill once it's been finalized without a manager's permission.
* **Why it matters:** Prevents theft, mistakes, and keeps the cashier focused solely on serving the customer quickly.

---

## 4. The Admin Dashboard Modules (The Back Office in Detail)
This is the secure website for the Owner and Manager. Here are its main sections (Modules):

### A. Menu & Inventory Management
* **Categories:** Grouping food items (e.g., "Soups", "South Indian", "Beverages").
* **Items:** Adding a specific dish (e.g., "Veg Manchow Soup"), setting its price, uploading a picture, and deciding which category it belongs to.
* **Stock/Availability:** Temporarily marking an item as "Out of Stock" so the cashier cannot accidentally sell it.

### B. Employee Management
* Creating user accounts for new cashiers or managers.
* Setting secure PIN codes or passwords for each staff member.
* Tracking which cashier processed which bill.

### C. Order & Sales Management
* A complete history of every single bill generated in the restaurant.
* **Non-Chargeable (NC) Tracking:** A special section to see all the times food was given away for free. It shows *who* approved it, *why* (the note), and the *name* of the person who received it.
* **Refund Tracking:** A log of any canceled orders or refunded money.

### D. Reports & Analytics (Business Intelligence)
* **Bill Summary Report:** A powerful search tool to find bills from a specific date range. You can filter by "Payment Mode" (Show me only Paytm sales today).
* **Top Sellers:** Find out which items are making the most money.
* **End of Day (Z-Report):** A summary of all cash that should be in the cash register at the end of the shift.

### E. Offers & Coupons Module
* Create custom discount codes (e.g., "FESTIVAL20" for 20% off).
* Set rules: "Only valid for orders over ₹500" or "Expires next week."

### F. Settings & Configuration
* **Taxes:** Set up GST or local taxes so they automatically add to the bill.
* **Receipt Customization:** Add the restaurant's name, address, phone number, and a "Thank You" message to the printed bill.

---

## 5. The POS App Modules (The Cashier's Tablet in Detail)
This is the app installed on the tablet at the restaurant. It is designed to be extremely fast and easy to use.

### A. The Ordering Screen (Dashboard)
* A visual grid of all food categories and items.
* Large buttons for fast tapping.
* A "Cart" on the side showing what the customer is currently ordering.

### B. Billing & Checkout
* Taking the total amount and splitting it if necessary (e.g., Customer pays ₹500 in Cash and ₹200 on Paytm).
* A "Search Coupon" pop-up to quickly type in a discount code and see the price drop.

### C. Exceptions: NC Orders & Cancellations
* **Mark as Non-Chargeable (NC):** A specific pop-up where the cashier must type a "Note" (e.g., "Owner's Friend") and the "Person's Name" to give a 100% discount.
* **Cancel Order / Remove Item:** Ability to easily fix mistakes before the final bill is printed.

### D. Hardware Printing
* Seamless connection to the receipt printer.
* Buttons to instantly "Print Previous Bill" if a customer loses their copy.

---

## 6. Technical Details & App Dependencies (Simplified)

*While this section is technical, it explains the "tools" the development team will use to build the app and why they are important.*

### The Client App (Built with Flutter)
Flutter allows us to build one high-quality app that works on Android, iPads, and Windows computers without writing the code three separate times.

**Key Tools (Dependencies) inside the App:**
1. **State Management (BLoC/Provider):** This is the memory of the app. It ensures that if a cashier adds a "Coffee" to the cart, the total price instantly updates without the screen freezing.
2. **Local Database (Hive/SQLite):** This is for **Offline Support**. If the restaurant's WiFi stops working, the app stores the menu and bills locally on the tablet. The cashier can keep billing customers. Once the WiFi comes back, the app silently uploads all the missing bills to the Admin Dashboard.
3. **Networking (Dio):** The courier service that securely carries data from the tablet to the Admin Dashboard over the internet.
4. **Printer Integration (Blue Thermal Printer):** The specific code needed to talk to the physical receipt printer via Bluetooth or USB to push out paper receipts instantly.

### The Backend (Built with Node.js)
Node.js acts as the powerful server running 24/7 in the cloud. It is incredibly fast at handling multiple requests at the same time (e.g., if you have 5 cashiers billing at once, the server handles it without slowing down). It connects to a secure database to store all your business data safely.
