# QuickPay Invoicing Dashboard

A dashboard interface inspired by the **QuickPay Invoicing** Dribbble design.  
This project was built as part of a frontend code challenge to demonstrate UI implementation, state management, and project structure using modern web technologies.

---

##  Design Reference

- **QuickPay Invoicing – Dribbble**
- Focused on layout, visual hierarchy, and interaction patterns rather than pixel-perfect replication.

---

##  Features

- Dashboard layout with sidebar navigation
- Payments overview section
- Payments table with status indicators
- Create Invoice panel (right-side form)
- Clean, card-based UI inspired by the original design
- Global state management using Zustand
- Mock data (no backend required)

---

##  Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (state management)

---

##  Project Structure
src/
 ├── app/
 │   ├── page.tsx              # Home (public landing)
 │   ├── login/
 │   │   └── page.tsx
 │   ├── register/
 │   │   └── page.tsx
 │   └── dashboard/
 │       └── page.tsx          # Dashboard entry
 │
 ├── components/
 │   ├── layout/
 │   │   ├── AppShell.tsx
 │   │   ├── Sidebar.tsx
 │   │   └── InvoicePanel.tsx
 │   ├── sections/
 │   │   ├── HomeSection.tsx
 │   │   ├── InvoicesSection.tsx
 │   │   ├── ClientsSection.tsx
 │   │   └── ...
 │
 ├── store/
 │   └── dashboardStore.ts


The project follows a scalable, feature-based structure: