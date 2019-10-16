"use strict";

// Input values are read after each user change in inputs
var state, housePrice, deposit, interestRate, yearsStaying;
function getInputValues() {
	state = $('#rent_buy_state_input').val();
	housePrice = parseInt($('#rent_buy_button_2_slider_input_1').val());
	deposit = parseInt($('#rent_buy_button_2_slider_input_2').val());
	interestRate = parseFloat($('#rent_buy_button_2_slider_input_3').val()) / 12 / 100;
	yearsStaying = parseInt($('#rent_buy_button_2_slider_input_4').val());


	// console.log(`inputs:`);
	// console.log( state );
	// console.log( housePrice );
	// console.log( deposit );
	// console.log( interestRate );
	// console.log( yearsStaying );

}

function calcSD(steps) {
	var maxValue = 0;
	var maxPerc = 0;
	if (steps.max) {
		var maxValue = steps.max.val;
		var maxPerc = steps.max.perc;
	}
	var calculatedValueSD = 0;

	// min indicates that Duty is calculated simply (perc for value * value)
	// and that there is a defferent calculation for first step (smalles prices)
	// this is for NT only
	if (steps.min) {
		if (housePrice < steps.rest['0'].valMin) {
			calculatedValueSD = 0.06571441 * housePrice / 1000 * housePrice / 1000 + 15 * housePrice / 1000;
		} else {
			if (housePrice >= steps.rest['2'].valMin) {
				calculatedValueSD = housePrice * steps.rest['2'].perc;
			} else {
				if (housePrice >= steps.rest['1'].valMin) {
					calculatedValueSD = housePrice * steps.rest['1'].perc;
				} else {
					calculatedValueSD = housePrice * steps.rest['0'].perc;
				}
			}
		}
	} else {
		// if no 'min' then other calculation happens
		// if there is a maxValue and hause value is greater than 'maxValue'
		// Duty is a simple (perc for max value * value)
		if ((steps.max) && (housePrice >= maxValue)) {
			calculatedValueSD = housePrice * maxPerc;
			//for the rest perc is calculated in steps	
		} else {
			for (var i = 0; i < Object.keys(steps.rest).length; i++) {
				// if there is a 'top' value for this 'step' and house value is greater then the perc will be calculated for whole 'step'
				if (steps.rest[i].valMax && (housePrice > steps.rest[i].valMax)) {
					calculatedValueSD += (steps.rest[i].valMax - steps.rest[i].valMin) * steps.rest[i].perc;
				} else {
					//else perc will be calculated for (house - 'bottom value of step')	
					if (housePrice >= steps.rest[i].valMin) {
						calculatedValueSD += (housePrice - steps.rest[i].valMin) * steps.rest[i].perc;
					}
				}
			}
		}
	}
	// TAS has fixed 50
	if (steps.fixed) {
		calculatedValueSD += steps.fixed;
	}
	return calculatedValueSD;
}

var availableDeposit, stamp, transfer, govtFees;
function calcAvailableDeposit() {
	switch (state) {
		case 'ACT':
			stamp = calcSD(ACT);
			transfer = ACT.transfer;
			govtFees = ACT.mortgage;
			break;
		case 'NSW':
			stamp = calcSD(NSW);
			transfer = NSW.transfer;
			govtFees = NSW.mortgage;
			break;
		case 'NT':
			stamp = calcSD(NT);
			transfer = NT.transfer;
			govtFees = NT.mortgage;
			break;
		case 'QlD':
			stamp = calcSD(QlD);
			if (housePrice > 180000) {
				transfer = 181 + 34 * Math.ceil((housePrice - 180000) / 10000);
			} else {
				transfer = 181;
			}
			govtFees = QlD.mortgage;
			break;
		case 'SA':
			stamp = calcSD(SA);
			transfer = 160;
			if (housePrice > 5000) { transfer = 178 };
			if (housePrice > 20000) { transfer = 195 };
			if (housePrice > 40000) { transfer = 274 };
			if (housePrice > 50000) {
				transfer = 274 + 80.5 * Math.ceil((housePrice + 1 - 50001) / 10000);
			}
			govtFees = SA.mortgage;
			break;
		case 'TAS':
			stamp = calcSD(TAS);
			transfer = TAS.transfer;
			govtFees = TAS.mortgage;
			break;
		case 'VIC':
			stamp = calcSD(VIC);
			transfer = Math.min(94.6 + 2.34 * Math.round(housePrice / 1000), 3605)
			govtFees = VIC.mortgage;
			break;
		case 'WA':
			stamp = calcSD(WA);
			if (housePrice > 0) {
				transfer = 168.70 * Math.ceil((housePrice + 1 - 0) / 100000) + 0;
			}
			if (housePrice > 85000) {
				transfer = 178.70 * Math.ceil((housePrice + 1 - 85001) / 100000) + 0;
			}
			if (housePrice > 120000) {
				transfer = 198.70 * Math.ceil((housePrice + 1 - 120001) / 100000) + 0;
			}
			if (housePrice > 200000) {
				transfer = 20 * Math.ceil((housePrice + 1 - 200001) / 100000) + 198.70;
			}
			govtFees = WA.mortgage;
			break;
	}
	availableDeposit = deposit - stamp - transfer - govtFees;
}

var totalLoan, mortgageRepayment;
var buyUpfront, buyCostOverTime, buyOpportunityCosts, buyEndCost, buyTotal;
var rentUpfront, rentCostOverTime, rentTotal, rentPerWeek;
function calculate() {

	calcAvailableDeposit();

	totalLoan = housePrice + 6503 - availableDeposit;    // LMI fixed here?
	mortgageRepayment = (totalLoan * interestRate * Math.pow(1 + interestRate, 25 * 12)) / (Math.pow(1 + interestRate, 25 * 12) - 1);

	// Buy
	buyUpfront = deposit;
	buyCostOverTime = yearsStaying * ((12 * mortgageRepayment) + 3119 + 0.01 * housePrice);
	buyOpportunityCosts = (deposit * Math.pow((1 + 0.04), yearsStaying)) - deposit + (Math.pow((1 + 0.04), yearsStaying) + (3119 + 0.01 * housePrice) * (1 + 0.04) * ((Math.pow((1 + 0.04), yearsStaying) - 1) / (0.04))) -
		(3119 + 0.01 * housePrice) * yearsStaying;
	buyEndCost = -(housePrice * Math.pow((1 + 0.03), yearsStaying)) * (1 - 0.025) - (-totalLoan * Math.pow((1 + interestRate), yearsStaying * 12) + mortgageRepayment * ((Math.pow((1 + interestRate), yearsStaying * 12) - 1) / interestRate));

	buyTotal = buyUpfront + buyCostOverTime + buyOpportunityCosts + buyEndCost;

	rentPerWeek = buyTotal / (yearsStaying * 52);

	// console.log('availableDeposit: ', availableDeposit);
	// console.log('totalLoan: ', totalLoan);
	// console.log('mortgageRepayment: ', mortgageRepayment);

	// console.log('buyUpfront: ', buyUpfront);
	// console.log('buyCostOverTime: ', buyCostOverTime);
	// console.log('buyOpportunityCosts: ', buyOpportunityCosts);
	// console.log('buyEndCost: ', buyEndCost);
	// console.log('buyTotal: ', buyTotal);

	// rent
	rentUpfront = 52 / 12 * rentPerWeek;
	rentCostOverTime = yearsStaying * 52 * rentPerWeek;

	rentTotal = rentCostOverTime;
	// console.log('rentPerWeek: ', rentPerWeek);
}

function writeResults() {
	if (rentPerWeek > 0) {
		$('#renting_advice').text('Renting is financially better for you if you can find a similar home for:');
		$('#renting_advice_h6').text('per week or less');
		$('#rent_value').text(`GHC${Math.ceil(Math.max(rentPerWeek, 0)).toLocaleString({ maximumFractionDigits: 0 })}`);
	} else {
		$('#renting_advice').text('Buying is financially better over your chosen timeframe, even if you can rent for free.');
		$('#rent_value, #renting_advice_h6').text('');
	}
	$('#typical_mortg_value').text(`GHC${Math.ceil(mortgageRepayment).toLocaleString({ maximumFractionDigits: 0 })}`);
}

function calcLifestyle() {
	if (($('.locationSpots').hasClass('activeSpots')) && ($('.owningSpots').hasClass('activeOwning')) && ($('.flexibilitySpots').hasClass('activeFlexibility')) && ($('.commitedSpots').hasClass('activeCommited'))) {
		var location = parseInt($('.activeSpots').attr('id').slice(-1));
		var owning = parseInt($('.activeOwning').attr('id').slice(-1));
		var flexibility = parseInt($('.activeFlexibility').attr('id').slice(-1));
		var commited = parseInt($('.activeCommited').attr('id').slice(-1));

		var average = location + owning + flexibility + commited;
		// console.log( average  );

		if ($('#rent_buy_range_point_2_spot_7').hasClass('activeOwning') || $('#rent_buy_range_point_4_spot_7').hasClass('activeCommited')) {
			$('#rent_buy_button_1_option_right_inputs_main_1_with_a_link_1').addClass('blockClass');
			$('#rent_buy_button_1_option_right_inputs_main_1_with_a_link_3, #rent_buy_button_1_option_right_inputs_main_1_with_a_link_2').removeClass('blockClass');
			$('html, body').animate({
				scrollTop: $("#rent_buy_button_1_option_right_inputs_main_1_with_a_link_1").offset().top
			}, 500);
		} else {
			if (average < 9) {
				$('#rent_buy_button_1_option_right_inputs_main_1_with_a_link_3').addClass('blockClass');
				$('#rent_buy_button_1_option_right_inputs_main_1_with_a_link_1, #rent_buy_button_1_option_right_inputs_main_1_with_a_link_2').removeClass('blockClass');
				$('html, body').animate({
					scrollTop: $("#rent_buy_button_1_option_right_inputs_main_1_with_a_link_3").offset().top
				}, 500);
			}
			if ((average >= 9) && (average < 24)) {
				$('#rent_buy_button_1_option_right_inputs_main_1_with_a_link_2').addClass('blockClass');
				$('#rent_buy_button_1_option_right_inputs_main_1_with_a_link_1, #rent_buy_button_1_option_right_inputs_main_1_with_a_link_3').removeClass('blockClass');
				$('html, body').animate({
					scrollTop: $("#rent_buy_button_1_option_right_inputs_main_1_with_a_link_2").offset().top
				}, 500);
			}
			if (average >= 24) {
				$('#rent_buy_button_1_option_right_inputs_main_1_with_a_link_1').addClass('blockClass');
				$('#rent_buy_button_1_option_right_inputs_main_1_with_a_link_3, #rent_buy_button_1_option_right_inputs_main_1_with_a_link_2').removeClass('blockClass');
				$('html, body').animate({
					scrollTop: $("#rent_buy_button_1_option_right_inputs_main_1_with_a_link_1").offset().top
				}, 500);
			}
		}
	}
}


// ***   Input and Click Handlers   **** //

// set deposit range to 5%-20%
$("#rent_buy_button_2_slider_input_1").on("input", function () {
	$("#rent_buy_button_2_slider_input_2").attr({
		"max": (1000 * Math.ceil(parseInt($("#rent_buy_button_2_slider_input_1").val()) / 1000))
	}).val(1000 * Math.ceil(0.1 * parseInt($("#rent_buy_button_2_slider_input_1").val()) / 1000))
		.trigger('input');

});

// Sliders  
var el, newPoint, newPlace, offset, width, nextOutputWidth;
$("#rent_buy_button_2_slider_input_1, #rent_buy_button_2_slider_input_2").on("input", function () {

	el = $(this);
	nextOutputWidth = el.next("output").width();
	width = el.width();


	// Figure out placement percentage between left and right of input
	newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
	// console.log(newPoint);

	// Janky value to get pointer to line up better
	offset = (50 - newPoint * 100) * 13 / 50;

	// Prevent bubble from going beyond left or right (unsupported browsers)
	if (newPoint < 0) { newPlace = 0; }
	else if (newPoint > 1) { newPlace = width; }
	else { newPlace = width * newPoint + offset; }

	// Move bubble
	el
		.next("output")
		.css({
			left: newPlace - nextOutputWidth / 2,
			marginLeft: 0
		})
		.text(`GHC ${parseInt(el.val()).toLocaleString({ maximumFractionDigits: 0 })}`);
})

$("#rent_buy_button_2_slider_input_3").on("input", function () {

	el = $(this);
	nextOutputWidth = el.next("output").width();
	width = el.width();
	// Figure out placement percentage between left and right of input
	newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
	// Janky value to get pointer to line up better
	offset = (50 - newPoint * 100) * 13 / 50;
	// Prevent bubble from going beyond left or right (unsupported browsers)
	if (newPoint < 0) { newPlace = 0; }
	else if (newPoint > 1) { newPlace = width; }
	else { newPlace = width * newPoint + offset; }
	// Move bubble
	el
		.next("output")
		.css({
			left: newPlace - nextOutputWidth / 2,
			marginLeft: 0
		})
		.text(parseFloat($(this).val()).toLocaleString('es-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
})

$("#rent_buy_button_2_slider_input_4").on("input", function () {

	el = $(this);
	nextOutputWidth = el.next("output").width();
	width = el.width();
	// Figure out placement percentage between left and right of input
	newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
	// Janky value to get pointer to line up better
	offset = (50 - newPoint * 100) * 13 / 50;
	// Prevent bubble from going beyond left or right (unsupported browsers)
	if (newPoint < 0) { newPlace = 0; }
	else if (newPoint > 1) { newPlace = width; }
	else { newPlace = width * newPoint + offset; }
	// Move bubble
	el
		.next("output")
		.css({
			left: newPlace - nextOutputWidth / 2,
			marginLeft: 0
		})
	if (parseInt(el.val()) < 2) {
		el.next("output").text(el.val() + ' year');
	} else {
		el.next("output").text(el.val() + ' years');
	}

})

$('#rent_buy_button_1').on("click", function () {
	$(this).addClass('activeClass');
	$('#rent_buy_button_2').removeClass('activeClass');
	$('#rent_buy_button_1_option_input_main').css("display", "block");
	$('#rent_buy_button_2_option_input_main').css("display", "none");
})
$('#rent_buy_button_2').on("click", function () {
	$(this).addClass('activeClass');
	$('#rent_buy_button_1').removeClass('activeClass');
	$('#rent_buy_button_2_option_input_main').css("display", "block");
	$('#rent_buy_button_1_option_input_main').css("display", "none");
	$("input[type='range']").trigger('input');
	$("#rent_buy_button_2_slider_input_1").trigger('input');
})
$('#rent_buy_button_2_option_right_inputs_subb_2 h5').on("click", function () {
	$('#rent_buy_button_1').addClass('activeClass');
	$('#rent_buy_button_2').removeClass('activeClass');
	$('#rent_buy_button_1_option_input_main').css("display", "block");
	$('#rent_buy_button_2_option_input_main').css("display", "none");
})
$('#rent_buy_button_1_right_link_a_2 > h5, #rent_buy_button_1_right_link_a_3 > h5, #rent_buy_button_1_right_link_a_1 > h5').on("click", function () {
	$('#rent_buy_button_2').addClass('activeClass');
	$('#rent_buy_button_1').removeClass('activeClass');
	$('#rent_buy_button_2_option_input_main').css("display", "block");
	$('#rent_buy_button_1_option_input_main').css("display", "none");
	$("input[type='range']").trigger('input');
	$("#rent_buy_button_2_slider_input_1").trigger('input');
})

$('.locationSpots').on("click", function () {
	$('.locationSpots').removeClass('activeSpots');
	$(this).addClass('activeSpots');
})
$('.owningSpots').on("click", function () {
	$('.owningSpots').removeClass('activeOwning');
	$(this).addClass('activeOwning');
})
$('.flexibilitySpots').on("click", function () {
	$('.flexibilitySpots').removeClass('activeFlexibility');
	$(this).addClass('activeFlexibility');
})
$('.commitedSpots').on("click", function () {
	$('.commitedSpots').removeClass('activeCommited');
	$(this).addClass('activeCommited');
})

$('.spotsClass').on("click", function () {
	calcLifestyle();
})




$('input, select').on("change", function () {
	getInputValues();
	calculate();
	writeResults();
});
$(function () {
	getInputValues();
	calculate();
	writeResults();

	//  ****** CHECK FOR DOUBLE NAMES, THERE IS ONE AT LEAST    timeDuringDay2

	// Warning Duplicate IDs
	$('[id]').each(function () {
		var ids = $('[id="' + this.id + '"]');
		if (ids.length > 1 && ids[0] == this)
			console.warn('Multiple IDs #' + this.id);
	});

	$('[name]').each(function () {
		var names = $('[name="' + this.name + '"]');
		if (names.length > 1 && names[0] == this)
			console.warn('Multiple names #' + this.name);
	});

});