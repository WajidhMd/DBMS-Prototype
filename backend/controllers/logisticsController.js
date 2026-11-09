// Logistics & Deliverability Controller

// Known Indian Pincode Regions Database
const PINCODE_MAP = {
  // Metros - Express 1-Day available
  '560': { city: 'Bengaluru', state: 'Karnataka', metro: true, days: 1 },
  '110': { city: 'New Delhi', state: 'Delhi', metro: true, days: 1 },
  '400': { city: 'Mumbai', state: 'Maharashtra', metro: true, days: 1 },
  '600': { city: 'Chennai', state: 'Tamil Nadu', metro: true, days: 1 },
  '700': { city: 'Kolkata', state: 'West Bengal', metro: true, days: 1 },
  '500': { city: 'Hyderabad', state: 'Telangana', metro: true, days: 1 },
  '411': { city: 'Pune', state: 'Maharashtra', metro: true, days: 1 },
  '380': { city: 'Ahmedabad', state: 'Gujarat', metro: true, days: 2 },
  '302': { city: 'Jaipur', state: 'Rajasthan', metro: false, days: 2 },
  '226': { city: 'Lucknow', state: 'Uttar Pradesh', metro: false, days: 2 },
  '682': { city: 'Kochi', state: 'Kerala', metro: false, days: 2 },
  '751': { city: 'Bhubaneswar', state: 'Odisha', metro: false, days: 3 },
  '800': { city: 'Patna', state: 'Bihar', metro: false, days: 3 },
  '781': { city: 'Guwahati', state: 'Assam', metro: false, days: 3 },
  '160': { city: 'Chandigarh', state: 'Punjab', metro: false, days: 2 }
};

export function checkPincodeDeliverability(req, res) {
  const { code } = req.params;
  const cleanCode = (code || '').trim();

  if (!/^\d{6}$/.test(cleanCode)) {
    return res.status(400).json({
      deliverable: false,
      error: 'Please enter a valid 6-digit Indian Postal PIN code.'
    });
  }

  const prefix = cleanCode.substring(0, 3);
  const region = PINCODE_MAP[prefix] || {
    city: 'Regional Hub',
    state: 'India',
    metro: false,
    days: 3
  };

  const today = new Date();
  const estDate = new Date(today);
  estDate.setDate(today.getDate() + region.days);

  const formattedDate = estDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return res.json({
    deliverable: true,
    pincode: cleanCode,
    city: region.city,
    state: region.state,
    estimatedDays: region.days,
    estimatedDeliveryDate: formattedDate,
    fastestSpeed: region.metro ? 'Same-Day / Next-Day Delivery available' : 'Standard 2-3 Days Delivery',
    codAvailable: true,
    expressAvailable: region.metro,
    freeDeliveryThreshold: 499
  });
}

// 3PL Tracking Details Generator
export function getOrderTrackingInfo(req, res) {
  const { orderId } = req.params;
  const numSeed = parseInt(orderId.replace(/\D/g, '') || '88101', 10);

  const couriers = ['Delhivery Express', 'BlueDart Apex', 'Shiprocket Prime', 'Shadowfax Logistics'];
  const courier = couriers[numSeed % couriers.length];
  const awbNumber = `AWB-JM-${(numSeed * 7919).toString().substring(0, 9)}`;

  const now = new Date();
  const t0 = new Date(now.getTime() - 36 * 3600000).toLocaleString('en-IN');
  const t1 = new Date(now.getTime() - 24 * 3600000).toLocaleString('en-IN');
  const t2 = new Date(now.getTime() - 12 * 3600000).toLocaleString('en-IN');
  const t3 = new Date(now.getTime() - 2 * 3600000).toLocaleString('en-IN');

  const timeline = [
    {
      status: 'Order Placed',
      location: 'JMART Central Fulfillment Center, Bengaluru',
      timestamp: t0,
      completed: true
    },
    {
      status: 'Package Dispatched & Handed over to 3PL',
      location: `Hub Sort Facility, ${courier}`,
      timestamp: t1,
      completed: true
    },
    {
      status: 'In Transit',
      location: 'National Sorting Gateway - In Transit to Local Destination Hub',
      timestamp: t2,
      completed: true
    },
    {
      status: 'Out for Delivery',
      location: 'Local Delivery Center',
      timestamp: t3,
      completed: true
    }
  ];

  return res.json({
    orderId,
    courier,
    awbNumber,
    currentStatus: 'In Transit / Out for Delivery',
    destinationCity: 'Customer Address',
    timeline
  });
}
