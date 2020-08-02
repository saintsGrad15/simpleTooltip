/**
 * Created by jcarrell on 10/7/18.
 */

/**
 * To use simpleTooltip...
 *
 * Requires: Bootstrap, jQuery
 *
 * Add to any HTML element the "data-toggle-stt" attribute. No value is necessary.
 *
 * To specify the content for the tooltip add the content as the value of the "stt-title" attribute.
 *
 * TODO This documentation and the functionality itself is a WIP...
 */


(function()
{
    "use strict";

    // On mouseover, create the tooltip
    $(document).on("mouseover", "[data-toggle-stt]", function(event)
    {
        const jqElement = $(event.currentTarget);

        if (jqElement.attr("data-original-title") === undefined)
        {
            const title = jqElement.attr("stt-title");
            const useFancy = jqElement.attr("data-toggle-stt-use-fancy") !== undefined;

            if (title !== undefined && title.length > 0)
            {
                console.debug("Applying simpleTooltip functionality to element", jqElement);

                const dataset = jqElement[0].dataset;
                const dataSetKeys = Object.keys(dataset);

                const sttDatasetKeys = dataSetKeys.filter((key) => key.startsWith("sttoption"));
                const tooltipOptions = {
                    trigger: "hover"
                };

                for (const sttDatasetKey of sttDatasetKeys)
                {
                    let value = dataset[sttDatasetKey];

                    try
                    {
                        value = JSON.parse(value);
                    }
                    catch(e){}

                    tooltipOptions[sttDatasetKey.replace("sttoption", "").toLowerCase()] = value;
                }

                tooltipOptions.title = title;

                let tooltipFunction;

                if (useFancy)
                    tooltipFunction = "fancyTooltip";
                else
                    tooltipFunction = "tooltip";

                jqElement[tooltipFunction](tooltipOptions);

                jqElement[tooltipFunction]("show");
            }
        }
    });

    // On mouseleave destroy the tooltip
    $(document).on("mouseleave", "[data-toggle-stt]", function(event)
    {
        $(event.currentTarget)
            .tooltip("destroy")
            .removeAttr("data-original-title");
    });
})();

function getNewJQElement(tagName)
{
    /*
     * Return a new, blank jQuery-wrapped element of tag name 'tagName'
     *
     * :param: tagName: (String) The tag name to generate.
     *
     * :return: jQuery-wrapped element of tag name 'tagName'
     */

    return $(`<${tagName}></${tagName}>`);
}

$.fn.fancyTooltip = function(options={}, type="info", excludeCustomCSS=false)
{
    /**
     * Enable a "fancy" (by John Carrell's definition) tool tip on the jQuery selected element(s).
     *
     * :param: options: (object) Custom options to pass directly to 'tooltip()'.
     *      Caveat: If 'options' contains the key "title"
     *          The value of that key will be used for the content of the tooltip
     *          then the "title" key will be deleted. This is done in order to prepend the glyphicon.
     *
     *      Default options automatically applied but overridden by 'options' are:
     *          html: true,
     *          animation: false
     *          placement: "auto right"
     *
     *      See BootstrapTooltip docs for details of these and other options.
     *
     *      NOTE: if the first argument is a string it will be passed directly to .tooltip()
     *      This enables the same "command" syntax that the .tooltip() interface exposes.
     *
     * :param: type: (str) An indication of how the dialog should be colored and which icon should be used.
     *      The supported values for 'type' are:
     *          "info"
     *          "success"
     *          "warning"
     *          "danger"
     *
     *      All coloring uses standard Bootstrap hex codes.
     *      If any other value is supplied (such as "none"), no icon will appear and there will be no background color.
     *
     * :param: excludeCustomCSS: (boolean) If true, will refrain from applying custom CSS (this is what makes it fancy!)
     *      In order to apply your own CSS know that the following HTML structure exists:
     *          <div class="customTooltip">
     *              <div class="customTooltipInner">
     *                  <span class="glyphicon ..."></span> [ content ]
     *              </div>
     *          </div>
     *
     *      Use the two "customTooltip[Inner]" classes to control the style.
     *
     * :return: None
     */

    if (typeof options === "string")
    {
        this.tooltip(options);
    }
    else
    {
        const templateWrapperDOM = $(getNewJQElement("div"));
        const customTooltipDOM = getNewJQElement("div")
            .addClass("tooltip customTooltip");
        const customTooltipInnerDOM = getNewJQElement("div")
            .addClass("tooltip-inner customToolTipInner");

        let iconClass, iconColor, backgroundColor;

        switch (type)
        {
            case "info":
                iconClass = "glyphicon-info-sign";
                iconColor = "#31708f";
                backgroundColor = "#d9edf7";
                break;

            case "success":
                iconClass = "glyphicon-ok-sign";
                iconColor = "#3c763d";
                backgroundColor = "#dff0d8";
                break;

            case "warning":
                iconClass = "glyphicon-exclamation-sign";
                iconColor = "#8a6d3b";
                backgroundColor = "#fcf8e3";
                break;

            case "danger":
                iconClass = "glyphicon-remove-sign";
                iconColor = "#a94442";
                backgroundColor = "#f2dede";
                break;

            default:
                backgroundColor = "#FFF";
        }

        let icon = "";

        if (iconClass !== undefined)
        {
            icon = `<span class="columnMenuItemInfoIcon glyphicon ${iconClass}" style="color: ${iconColor}"></span> `;
        }

        let title = icon;

        if ("title" in options)
        {
            title += options.title;

            delete options.title;
        }
        else if (this.attr("title") !== undefined)
        {
            title += this.attr("title");
        }

        if (!excludeCustomCSS)
        {
            customTooltipDOM.css("opacity", 1);

            customTooltipInnerDOM
                .css("width", "max-content")
                .css("width", "-moz-max-content")
                .css("font-size", "14px")
                .css("max-width", "300px")
                .css("color", "black")
                .css("border", "1px solid black")
                .css("box-shadow", "0 0 5px 3px white");

            if (backgroundColor !== undefined)
                customTooltipInnerDOM
                    .css("background-color", backgroundColor);
        }

        customTooltipDOM.append(customTooltipInnerDOM);
        templateWrapperDOM.append(customTooltipDOM);

        const defaultOptions = {
            title: title,
            template: templateWrapperDOM.html(),
            html: true,
            animation: false,
            placement: "auto right"
        };

        const finalOptions = $.extend(true, defaultOptions, options);

        this.tooltip(finalOptions);
    }
};
