/*global QUnit */
/*eslint no-undef:1, no-unused-vars:1, strict: 1 */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/m/ObjectNumber",
	"jquery.sap.global",
	"sap/ui/core/library"
], function(QUnitUtils, createAndAppendDiv, ObjectNumber, jQuery, coreLibrary) {
	// shortcut for sap.ui.core.TextAlign
	var TextAlign = coreLibrary.TextAlign;

	// shortcut for sap.ui.core.TextDirection
	var TextDirection = coreLibrary.TextDirection;

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	createAndAppendDiv("content");



	QUnit.test("ShouldRenderObjectNumber", function(assert) {
		//SUT
		var sNumber = "5",
			sNumberUnit = "Euro",
			sut = new ObjectNumber("on1", {
				number: sNumber,
				numberUnit : sNumberUnit
			});

		//Act
		sut.placeAt("content");
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(jQuery(".sapMObjectNumberText:contains(" + sNumber + ")").length,1,"Number should be there");
		assert.equal(jQuery(".sapMObjectNumberUnit:contains(" + sNumberUnit + ")").length,1,"Number unit should be there");

		$ontxt = jQuery("#on1").find(".sapMObjectNumberText");
		var sFontWeight = $ontxt.css("font-weight");
		assert.equal((sFontWeight === "bold" || sFontWeight === "700"), true, "font weight should be bold by default"); // IE and FF return "700" while chrome returns "bold"

		//Cleanup
		sut.destroy();
	});

	QUnit.test("ShouldRenderUnit", function(assert) {
		//SUT
		var sUnit = "Dollar";
		sut = new ObjectNumber("unit", {
		number: "10",
		unit : sUnit,
		numberUnit: "Euro"
		});

		//Act
		sut.placeAt("content");
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(jQuery(".sapMObjectNumberUnit:contains(" + sUnit + ")").length,1,"unit should be used instead of numberUnit");

		//Cleanup
		sut.destroy();
	});

	QUnit.test("Should not render unit element when Unit is empty", function(assert) {

		// System under test
		var oObjectNumber = new ObjectNumber("onUnit", {
			number: 256
		});

		oObjectNumber.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(jQuery("#onUnit").find(".sapMObjectNumberUnit").length, 0, "No unit span is rendered when the Unit is null.");

		oObjectNumber.setUnit("");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(jQuery("#onUnit").find(".sapMObjectNumberUnit").length, 0, "No unit span is rendered when the Unit is empty string.");

		// Clean up
		oObjectNumber.destroy();
	});

	QUnit.test("Non-emphasized ObjectNumber", function(assert) {
		//SUT

		var sNumber = "5",
			sNumberUnit = "Euro",
			sut = new ObjectNumber("on2", {
				number: sNumber,
				numberUnit : sNumberUnit,
				emphasized: false
			});

		//Act
		sut.placeAt("content");
		sap.ui.getCore().applyChanges();

		//Assert
		$ontxt = jQuery("#on2").find(".sapMObjectNumberText");
		var expected = jQuery.browser.webkit ? "normal" : "400";
		// check if the jQuery version is lower than 1.10 then use "normal" will be set as font-weigt
		// from jQuery 1.10 jQuery converts the font-weight of "normal" into 400
		expected = jQuery.sap.Version(jQuery.fn.jquery).compareTo("1.10") > 0 ? "400" : expected;
		assert.equal($ontxt.css("font-weight"), expected, "font weight of non-emphasized ObjectNumber should be " + expected);

		//Cleanup
		sut.destroy();
	});

	QUnit.test("ValueState of ObjectNumber", function(assert) {
		//SUT

		var sNumber = "5",
			sNumberUnit = "Euro",
			sut = new ObjectNumber("on3", {
				number: sNumber,
				numberUnit : sNumberUnit
			});

		//Act
		sut.placeAt("content");
		sap.ui.getCore().applyChanges();

		//Assert
		//Check value
		$ontxt = jQuery("#on3");
		assert.ok($ontxt.hasClass("sapMObjectNumberStatusNone"), "Object Number should be assigned css class 'sapMObjectNumberStatusNone'" );

		var aValueStates = [
			ValueState.Error,
			ValueState.Warning,
			ValueState.Success,
			ValueState.Information,
			ValueState.None];

		for (var i = 0; i < aValueStates.length; i++) {
			sut.setState(aValueStates[i]);
			sap.ui.getCore().applyChanges();
			var sStatusClass = "sapMObjectNumberStatus" + aValueStates[i];
			$ontxt = jQuery("#on3");
			assert.ok($ontxt.hasClass(sStatusClass), "Object Number should be assigned css class '" + sStatusClass + "'" );
			if (i > 0) {
				//Make sure that the old class got removed
				var sFormerStatusClass = "sapMObjectNumberStatus" + aValueStates[i - 1];
				assert.ok(!$ontxt.hasClass(sFormerStatusClass), "Object Number should not be assigned css class '" + sFormerStatusClass + "' any more." );
			}
		}


		//Cleanup
		sut.destroy();
	});

	QUnit.test("RTL ObjectNumber", function(assert) {
		//SUT
		var on4 = new ObjectNumber("on4", {
			number: "1.50",
			unit: "Euro",
			textDirection: TextDirection.LTR,
			textAlign: TextAlign.Begin
		});

		var on5 = new ObjectNumber("on5", {
			number: "1.50",
			unit: "Euro",
			textDirection: TextDirection.LTR,
			textAlign: TextAlign.End
		});

		var on6 = new ObjectNumber("on6", {
			number: "1.50",
			unit: "וְהָיוּ הַדְּבָרִים",
			textDirection: TextDirection.RTL,
			textAlign: TextAlign.Begin
		});

		var on7 = new ObjectNumber("on7", {
			number: "1.50",
			unit: "וְהָיוּ הַדְּבָרִים",
			textDirection: TextDirection.RTL,
			textAlign: TextAlign.End
		});

		//Act
		on4.placeAt("content");
		on5.placeAt("content");
		on6.placeAt("content");
		on7.placeAt("content");

		sap.ui.getCore().applyChanges();

		//Assert
		var $onnum = jQuery("#on4").find(".sapMObjectNumberText");
		var $onunit = jQuery("#on4").find(".sapMObjectNumberUnit");

		assert.ok($onnum.offset().left === 0, "object number is left aligned");
		assert.ok($onunit.offset().left > $onnum.offset().left, "number unit is on the right side of the number.");

		$onnum = jQuery("#on5").find(".sapMObjectNumberText");
		$onunit = jQuery("#on5").find(".sapMObjectNumberUnit");

		assert.ok($onnum.offset().left > 0, "object number is right aligned");
		assert.ok($onunit.offset().left > $onnum.offset().left, "number unit is on the right side of the number.");

		$onnum = jQuery("#on6").find(".sapMObjectNumberText");
		$onunit = jQuery("#on6").find(".sapMObjectNumberUnit");

		assert.ok($onunit.offset().left > 0, "object number is right aligned");
		assert.ok($onunit.offset().left < $onnum.offset().left, "number unit is on the left side of the number.");
		$onnum = jQuery("#on7").find(".sapMObjectNumberText");
		$onunit = jQuery("#on7").find(".sapMObjectNumberUnit");

		assert.ok($onunit.offset().left === 0, "object number is left aligned");
		assert.ok($onunit.offset().left < $onnum.offset().left, "number unit is on the left side of the number.");

		//Cleanup
		on4.destroy();
		on5.destroy();
		on6.destroy();
		on7.destroy();
	});

	QUnit.module("Screen reader support");

	QUnit.test("Basic rendering - state: None", function(assert) {
		ariaLabelSetCorrectly(ValueState.None);
	});

	QUnit.test("Basic rendering - state: Success", function(assert) {
		ariaLabelSetCorrectly(ValueState.Success);
	});

	QUnit.test("Basic rendering - state: Warning", function(assert) {
		ariaLabelSetCorrectly(ValueState.Warning);
	});

	QUnit.test("Basic rendering - state: Error", function(assert) {
		ariaLabelSetCorrectly(ValueState.Error);
	});

	QUnit.test("Value state None (default)", function(assert) {

		// System under test
		var oObjectNumber = new ObjectNumber({
			number: 256,
			unit: "EUR"
		});

		oObjectNumber.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(oObjectNumber.$("state").length, 0, "No label for the default state.");

		// Clean up
		oObjectNumber.destroy();
	});

	QUnit.test("Value state Success", function(assert) {

		// System under test
		var oObjectNumber = new ObjectNumber({
			number: 256,
			unit: "EUR",
			state: ValueState.Success
		});

		oObjectNumber.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		var $valueState = oObjectNumber.$("state");
		assert.strictEqual($valueState.length, 1, "There is a label for the value state.");
		assert.ok($valueState.hasClass("sapUiInvisibleText"), "The label is invisible.");
		assert.strictEqual($valueState.attr("aria-hidden"), "false", "The label has aria-hidden=\"false\".");
		assert.strictEqual($valueState.html(),
					sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("OBJECTNUMBER_ARIA_VALUE_STATE_SUCCESS"),
					"The text for value state \"Success\" is taken from the message bundle."
		);

		// Clean up
		oObjectNumber.destroy();
	});

	QUnit.test("Value state Warning", function(assert) {

		// System under test
		var oObjectNumber = new ObjectNumber({
			number: 256,
			unit: "EUR",
			state: ValueState.Warning
		});

		oObjectNumber.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		var $valueState = oObjectNumber.$("state");
		assert.strictEqual($valueState.length, 1, "There is a label for the value state.");
		assert.ok($valueState.hasClass("sapUiInvisibleText"), "The label is invisible.");
		assert.strictEqual($valueState.attr("aria-hidden"), "false", "The label has aria-hidden=\"false\".");
		assert.strictEqual($valueState.html(),
					sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("OBJECTNUMBER_ARIA_VALUE_STATE_WARNING"),
					"The text for value state \"Warning\" is taken from the message bundle."
		);

		// Clean up
		oObjectNumber.destroy();
	});

	QUnit.test("Value state Error", function(assert) {

		var oObjectNumber = new ObjectNumber({
			number: 256,
			unit: "EUR",
			state: ValueState.Error
		});

		oObjectNumber.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		var $valueState = oObjectNumber.$("state");
		assert.strictEqual($valueState.length, 1, "There is a label for the value state.");
		assert.ok($valueState.hasClass("sapUiInvisibleText"), "The label is invisible.");
		assert.strictEqual($valueState.attr("aria-hidden"), "false", "The label has aria-hidden=\"false\".");
		assert.strictEqual($valueState.html(),
					sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("OBJECTNUMBER_ARIA_VALUE_STATE_ERROR"),
					"The text for value state \"Error\" is taken from the message bundle."
		);

		// Clean up
		oObjectNumber.destroy();
	});

	QUnit.test("Value state Error set with setState when the state initialy was Warning", function(assert) {

		var oObjectNumber = new ObjectNumber({
			number: 256,
			unit: "EUR",
			state: ValueState.Warning
		});

		oObjectNumber.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oRenderSpy = this.spy(oObjectNumber, "invalidate");
		oObjectNumber.setState(ValueState.Error);
		sap.ui.getCore().applyChanges();

		// Assert
		var $valueState = oObjectNumber.$("state");
		assert.strictEqual($valueState.length, 1, "There is a label for the value state.");
		assert.ok($valueState.hasClass("sapUiInvisibleText"), "The label is invisible.");
		assert.strictEqual($valueState.attr("aria-hidden"), "false", "The label has aria-hidden=\"false\".");
		assert.strictEqual($valueState.text(),
					sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("OBJECTNUMBER_ARIA_VALUE_STATE_ERROR"),
					"The text for value state \"Error\" is taken from the message bundle."
		);

		// Clean up
		oObjectNumber.destroy();
	});

	QUnit.test("Value state Error set with setState when the state initialy was None", function(assert) {

		var oRenderSpy,
			oObjectNumber = new ObjectNumber({
			number: 256,
			unit: "EUR"
		});

		oObjectNumber.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oRenderSpy = this.spy(oObjectNumber, "invalidate");
		oObjectNumber.setState(ValueState.Error);
		sap.ui.getCore().applyChanges();

		// Assert
		var $valueState = oObjectNumber.$("state");
		assert.strictEqual($valueState.length, 1, "There is a label for the value state.");
		assert.ok($valueState.hasClass("sapUiInvisibleText"), "The label is invisible.");
		assert.strictEqual($valueState.attr("aria-hidden"), "false", "The label has aria-hidden=\"false\".");
		assert.strictEqual($valueState.html(),
					sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("OBJECTNUMBER_ARIA_VALUE_STATE_ERROR"),
					"The text for value state \"Error\" is taken from the message bundle."
		);
		assert.strictEqual(oRenderSpy.callCount, 1, "ObjectNumber was rerendered");

		// Clean up
		oObjectNumber.destroy();
		oRenderSpy.restore();
	});

	function ariaLabelSetCorrectly(labelState){
		// System under test
		var oObjectNumber = new ObjectNumber({
			number: 256,
			unit: "EUR",
			state: labelState
		});

		oObjectNumber.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		if (oObjectNumber.getState() !== ValueState.None) {
			assert.equal(oObjectNumber.$().attr("aria-describedby"), oObjectNumber.getId() + "-state", "aria-describedby is set correctly.");
		} else {
			assert.equal(oObjectNumber.$().attr("aria-describedby"), undefined, "aria-describedby is set correctly.");
		}

		// Clean up
		oObjectNumber.destroy();
	}
});