function createRoundPayload(day, hour, flightLoads, kitOrders){
  return {
    day: day,
    hour: hour,
    flightLoads: flightLoads,
    kitPurchasingOrders: kitOrders,
  };
};