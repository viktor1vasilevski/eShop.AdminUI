import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class PdfReportService {
  constructor() {}

  /** Print a single order as PDF */
  printOrder(order: any, userInfo: any) {
    const doc = new jsPDF();

    // --- User Info Header ---
    doc.setFontSize(14);
    doc.text('User Information', 10, 15);
    doc.setFontSize(12);
    doc.text(`First Name: ${userInfo?.firstName}`, 10, 25);
    doc.text(`Last Name: ${userInfo?.lastName}`, 10, 32);
    doc.text(`Username: ${userInfo?.username}`, 10, 39);

    // --- Order Info ---
    doc.setFontSize(14);
    doc.text(`Order #${order.id || ''}`, 10, 55);
    doc.setFontSize(12);
    doc.text(
      `Date: ${new Date(order.orderCreatedOn).toLocaleString()}`,
      10,
      65
    );

    // --- Items Table ---
    autoTable(doc, {
      startY: 75,
      head: [['Product', 'Quantity', 'Unit Price', 'Total']],
      body: order.items.map((i: any) => [
        i.productName,
        i.quantity,
        `$${i.unitPrice.toFixed(2)}`,
        `$${(i.unitPrice * i.quantity).toFixed(2)}`,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [73, 80, 87] },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
      },
    });

    // --- Order Total ---
    const finalY = (doc as any).lastAutoTable.finalY || 90;
    doc.text(`Order Total: $${order.totalAmount.toFixed(2)}`, 10, finalY + 10);

    doc.save(`order-${order.id || 'unknown'}.pdf`);
  }

  /** Print all orders in one PDF */
  printAllOrders(orders: any[], userInfo: any) {
    const doc = new jsPDF();

    // --- User Info Header ---
    doc.setFontSize(14);
    doc.text('User Information', 10, 15);
    doc.setFontSize(12);
    doc.text(`First Name: ${userInfo?.firstName}`, 10, 25);
    doc.text(`Last Name: ${userInfo?.lastName}`, 10, 32);
    doc.text(`Username: ${userInfo?.username}`, 10, 39);

    // --- Report Title ---
    doc.setFontSize(16);
    doc.text('All Orders Report', 10, 55);

    // --- Orders Table ---
    autoTable(doc, {
      startY: 65,
      head: [['Date', 'Items', 'Total']],
      body: orders.map((o) => [
        new Date(o.orderCreatedOn).toLocaleDateString(),
        o.items.map((i: any) => `${i.productName} (x${i.quantity})`).join(', '),
        `$${o.totalAmount.toFixed(2)}`,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [73, 80, 87] },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'left' },
        2: { halign: 'right' },
      },
    });

    // --- Grand Total ---
    const finalY = (doc as any).lastAutoTable.finalY || 80;
    const grandTotal = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    doc.setFontSize(12);
    doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 10, finalY + 10);

    doc.save('all-orders.pdf');
  }
}
