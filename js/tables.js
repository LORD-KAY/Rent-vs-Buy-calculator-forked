"use strict";

const ACT = {
	"transfer" : 372,
	"mortgage" : 140,
	"max" : {
		"val" : 1455000,
		"perc" : 0.0491
	},
	"rest" : {
		"0" : {
			"valMin" : 0,
			"valMax" : 200000,
			"perc" : 0.0140
		},
		"1" : {
			"valMin" : 200001,
			"valMax" : 300000,
			"perc" : 0.0240
		},
		"2" : {
			"valMin" : 300001,
			"valMax" : 500000,
			"perc" : 0.0380
		},
		"3" : {
			"valMin" : 500001,
			"valMax" : 750000,
			"perc" : 0.0478
		},
		"4" : {
			"valMin" : 750001,
			"valMax" : 1000000,
			"perc" : 0.0630
		},
		"5" : {
			"valMin" : 1000001,
			"valMax" : 1454999,
			"perc" : 0.0680
		}	
	}
}

const NSW = {
	"transfer" : 138.8,
	"mortgage" : 138.8,
	"rest" : {
		"0" : {
			"valMin" : 0,
			"valMax" : 14000,
			"perc" : 0.0125
		},
		"1" : {
			"valMin" : 14001,
			"valMax" : 30000,
			"perc" : 0.0150
		},
		"2" : {
			"valMin" : 30001,
			"valMax" : 80000,
			"perc" : 0.0175
		},
		"3" : {
			"valMin" : 80001,
			"valMax" : 300000,
			"perc" : 0.0350
		},
		"4" : {
			"valMin" : 300001,
			"valMax" : 1000000,
			"perc" : 0.0450
		},
		"5" : {
			"valMin" : 1000001,
			"valMax" : 3000000,
			"perc" : 0.0550
		},
		"6" : {
			"valMin" : 3000001,
			"perc" : 0.0700
		}	
	}
}

const NT = {
	"transfer" : 142,
	"mortgage" : 142,
	"min" : true,
	"rest" : {
		"0" : {
			"valMin" : 525001,
			"perc" : 0.0495
		},
		"1" : {
			"valMin" : 3000001,
			"perc" : 0.0545
		},
		"2" : {
			"valMin" : 5000001,
			"perc" : 0.0595
		}	
	}
}

const QlD = {
	"mortgage" : 181,
	"rest" : {
		"0" : {
			"valMin" : 0,
			"valMax" : 5000,
			"perc" : 0
		},
		"1" : {
			"valMin" : 5001,
			"valMax" : 75000,
			"perc" : 0.0150
		},
		"2" : {
			"valMin" : 75001,
			"valMax" : 540000,
			"perc" : 0.0350
		},
		"3" : {
			"valMin" : 540001,
			"valMax" : 1000000,
			"perc" : 0.0450
		},
		"4" : {
			"valMin" : 1000001,
			"perc" : 0.0575
		}
	}
}

const SA = {
	"mortgage" : 160,
	"rest" : {
		"0" : {
			"valMin" : 0,
			"valMax" : 12000,
			"perc" : 0.0100
		},
		"1" : {
			"valMin" : 12001,
			"valMax" : 30000,
			"perc" : 0.0200
		},
		"2" : {
			"valMin" : 30001,
			"valMax" : 50000,
			"perc" : 0.0300
		},
		"3" : {
			"valMin" : 50001,
			"valMax" : 100000,
			"perc" : 0.0350
		},
		"4" : {
			"valMin" : 100001,
			"valMax" : 200000,
			"perc" : 0.0400
		},
		"5" : {
			"valMin" : 200001,
			"valMax" : 250000,
			"perc" : 0.0425
		},
		"6" : {
			"valMin" : 250001,
			"valMax" : 300000,
			"perc" : 0.0475
		},
		"7" : {
			"valMin" : 300001,
			"valMax" : 500000,
			"perc" : 0.0500
		},
		"8" : {
			"valMin" : 500001,
			"perc" : 0.0550
		}	
	}
}

const TAS = {
	"transfer" : 204,
	"mortgage" : 133,
	"fixed" : 50,
	"rest" : {
		"0" : {
			"valMin" : 0,
			"valMax" : 3000,
			"perc" : 0.0000
		},
		"1" : {
			"valMin" : 3001,
			"valMax" : 25000,
			"perc" : 0.0175
		},
		"2" : {
			"valMin" : 25001,
			"valMax" : 75000,
			"perc" : 0.0225
		},
		"3" : {
			"valMin" : 75001,
			"valMax" : 200000,
			"perc" : 0.0350
		},
		"4" : {
			"valMin" : 200001,
			"valMax" : 375000,
			"perc" : 0.0400
		},
		"5" : {
			"valMin" : 375001,
			"valMax" : 725000,
			"perc" : 0.0425
		},
		"6" : {
			"valMin" : 725001,
			"perc" : 0.0450
		}	
	}
}

const VIC = {
	"mortgage" : 114.9,
	"max" : {
		"val" : 960001,
		"perc" : 0.0550
	},
	"rest" : {
		"0" : {
			"valMin" : 0,
			"valMax" : 25000,
			"perc" : 0.0140
		},
		"1" : {
			"valMin" : 25001,
			"valMax" : 130000,
			"perc" : 0.0240
		},
		"2" : {
			"valMin" : 130001,
			"valMax" : 960000,
			"perc" : 0.0600
		}
	}
}

const WA = {
	"mortgage" : 168.7,
	"rest" : {
		"0" : {
			"valMin" : 0,
			"valMax" : 120000,
			"perc" : 0.0190
		},
		"1" : {
			"valMin" : 120001,
			"valMax" : 150000,
			"perc" : 0.0285
		},
		"2" : {
			"valMin" : 150001,
			"valMax" : 360000,
			"perc" : 0.0380
		},
		"3" : {
			"valMin" : 360001,
			"valMax" : 725000,
			"perc" : 0.0475
		},
		"4" : {
			"valMin" : 725001,
			"perc" : 0.0515
		}	
	}
}











