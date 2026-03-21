import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

const transactions = [
    { date: "Mar 18", desc: "Added credits", amount: "+$100.00", positive: true, type: "Credit", balance: "$340.00" },
    { date: "Mar 17", desc: "RCS Campaign - Holiday", amount: "-$12.45", positive: false, type: "Debit", balance: "$240.00" },
    { date: "Mar 15", desc: "WhatsApp Messages", amount: "-$8.30", positive: false, type: "Debit", balance: "$252.45" },
    { date: "Mar 12", desc: "Added credits", amount: "+$50.00", positive: true, type: "Credit", balance: "$260.75" },
    { date: "Mar 10", desc: "RCS Campaign - Welcome", amount: "-$15.20", positive: false, type: "Debit", balance: "$210.75" },
    { date: "Mar 08", desc: "Monthly plan renewal", amount: "-$29.00", positive: false, type: "Debit", balance: "$225.95" },
];

const planFeatures = [
    "Up to 10,000 messages/month",
    "2 active channels",
    "Basic analytics & reports",
];

export default function BillingPage() {
    return (
        <div className="space-y-8">
            <PageHeading
                title="Billing"
                subtitle="Manage your balance, plan, and payment methods."
            />

            {/* Balance Card */}
            <div className="card-warm border-primary/20">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                        <p className="text-4xl font-bold text-foreground mt-2">$240.00</p>
                        <p className="text-sm text-muted-foreground mt-1">Auto-recharge at $50 threshold</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button>Add Credits</Button>
                        <Button variant="outline">View Invoices</Button>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Used $60 of $300 monthly limit</span>
                        <span>20%</span>
                    </div>
                    <div className="h-2 rounded-full bg-border">
                        <div className="h-full w-[20%] rounded-full bg-primary/60" />
                    </div>
                </div>
            </div>

            {/* Plan + Payment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Plan */}
                <div className="card-warm flex flex-col">
                    <h3 className="section-heading">Current Plan</h3>
                    <p className="text-lg font-semibold text-foreground mt-2">Starter Plan</p>
                    <p className="text-2xl font-bold text-foreground mt-1">$29<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                    <ul className="mt-4 space-y-2.5 flex-1">
                        {planFeatures.map((f) => (
                            <li key={f} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{f}</span>
                            </li>
                        ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-6">Upgrade Plan</Button>
                </div>

                {/* Payment Method */}
                <div className="card-warm">
                    <h3 className="section-heading mb-4">Payment Method</h3>
                    <div className="bg-foreground rounded-xl p-5 text-background">
                        <div className="flex justify-end">
                            <span className="text-sm font-bold">VISA</span>
                        </div>
                        <p className="text-lg font-mono tracking-wider mt-6">
                            &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242
                        </p>
                        <div className="flex justify-between mt-6 text-xs">
                            <span>12/28</span>
                            <span>JOHN DOE</span>
                        </div>
                    </div>
                    <p className="text-sm text-primary font-medium cursor-pointer mt-4 hover:underline">
                        Update Payment Method
                    </p>
                </div>
            </div>

            {/* Transaction History */}
            <div className="card-warm">
                <h3 className="section-heading mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                {["Date", "Description", "Amount", "Type", "Balance After"].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left py-2.5 text-xs text-muted-foreground font-medium border-b border-border"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((row, i) => (
                                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="py-3 text-foreground">{row.date}</td>
                                    <td className="py-3 text-foreground">{row.desc}</td>
                                    <td className={`py-3 font-medium ${row.positive ? "text-green-700" : "text-red-500"}`}>
                                        {row.amount}
                                    </td>
                                    <td className="py-3">
                                        <Badge variant={row.type === "Credit" ? "active" : "rejected"}>
                                            {row.type}
                                        </Badge>
                                    </td>
                                    <td className="py-3 text-muted-foreground">{row.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
