
import React from "react";
import { useAuth } from "../rbac/AuthContext";

const plans = [
  {
    name: "Basic",
    price: "₹4,999/month",
    features: ["100 Patients", "5 Doctors", "Basic Reports"],
  },
  {
    name: "Pro",
    price: "₹9,999/month",
    features: ["500 Patients", "20 Doctors", "Advanced Reports"],
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    features: ["Unlimited Access", "Multi Hospital", "Priority Support"],
  },
];

const SubscriptionPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Plans</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border rounded-xl p-6 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-2xl font-bold my-4">{plan.price}</p>

            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="text-gray-600">
                  • {feature}
                </li>
              ))}
            </ul>

            {currentUser?.roleId === 'super_admin' || currentUser?.roleId === 'hospital_admin' ? (
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Upgrade Plan
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {currentUser?.roleId === 'super_admin' ? (
        <div className="mt-8">
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            Cancel Subscription
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SubscriptionPage;