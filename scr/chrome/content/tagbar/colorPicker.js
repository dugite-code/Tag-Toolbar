var gColorPicker;

function onLoad()
{
	var arguments = window.arguments[0];
	gColorPicker = new ColorPicker(arguments);
	gColorPicker.init();
}

function ColorPicker(arg)
{
	this.retObj = arg;
	this.retObj.cancel = true;
	this.initialized = false;
	this.colorPickerElem = document.getElementById("colorpicker");
	this.noColorButtonElem = document.getElementById("button_no_color");
	this.clearColorButtonElem = document.getElementById("button_clear_color");
}

ColorPicker.prototype.init = function()
{
	this.colorPickerElem.color = this.retObj.color;
	if (this.retObj.color == "") this.noColorButtonElem.checked = true;
	else if (this.retObj.color == "NONE") this.clearColorButtonElem.checked = true;
	this.initialized = true;
}

ColorPicker.prototype.onChangeColorByButton = function(button)
{
	this.retObj.color = button.getAttribute("color");
	this.retObj.cancel = false;
	window.close();
}

ColorPicker.prototype.onChangeColorByPicker = function()
{
	if (!this.initialized) return;
	this.retObj.color = this.colorPickerElem.color;
	this.retObj.cancel = false;
	window.close();
}