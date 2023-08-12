
/////////////////////////////////////////////////////////////////////
// Determine the accessible color of text
/////////////////////////////////////////////////////////////////////
export const getThemeAccessibleColor = (color) => {
    if (color){
        color = color.trim()
        let colors = color.split(" ")
        // rgb values
        var r = parseInt(colors[0].trim())
        var g = parseInt(colors[1].trim())
        var b = parseInt(colors[2].trim())
        var yiq = (r * 299 + g * 587 + b * 114) / 1000
        return yiq >= 128 ? "0,0,0" : "255,255,255"
    }
}

export const rgbToHex = (r, g, b) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}