import type { Chart, ChartSeries } from './hoja';
import { escapeXml } from './referencias';

const NS =
  'xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';

const solid = (color: string) => '<a:solidFill><a:srgbClr val="' + color + '"/></a:solidFill>';

const text = (size: number, color: string, bold = false) =>
  '<c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="' +
  size +
  '"' +
  (bold ? ' b="1"' : '') +
  '>' +
  solid(color) +
  '</a:defRPr></a:pPr><a:endParaRPr lang="es-CO"/></a:p></c:txPr>';

function titleXml(title: string) {
  return (
    '<c:title><c:tx><c:rich><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="1200" b="1">' +
    solid('0B2E26') +
    '</a:defRPr></a:pPr><a:r><a:rPr lang="es-CO" sz="1200" b="1">' +
    solid('0B2E26') +
    '</a:rPr><a:t>' +
    escapeXml(title) +
    '</a:t></a:r></a:p></c:rich></c:tx><c:overlay val="0"/></c:title>'
  );
}

function categoriesXml(series: ChartSeries) {
  return (
    '<c:cat><c:strRef><c:f>' +
    escapeXml(series.categories) +
    '</c:f><c:strCache><c:ptCount val="' +
    series.categoryCache.length +
    '"/>' +
    series.categoryCache
      .map((value, index) => '<c:pt idx="' + index + '"><c:v>' + escapeXml(value) + '</c:v></c:pt>')
      .join('') +
    '</c:strCache></c:strRef></c:cat>'
  );
}

function valuesXml(series: ChartSeries, format: string) {
  return (
    '<c:val><c:numRef><c:f>' +
    escapeXml(series.values) +
    '</c:f><c:numCache><c:formatCode>' +
    escapeXml(format) +
    '</c:formatCode><c:ptCount val="' +
    series.valueCache.length +
    '"/>' +
    series.valueCache
      .map((value, index) => '<c:pt idx="' + index + '"><c:v>' + value + '</c:v></c:pt>')
      .join('') +
    '</c:numCache></c:numRef></c:val>'
  );
}

function labelsXml(chart: Chart) {
  const round = chart.kind === 'doughnut' || chart.kind === 'pie';
  return (
    '<c:dLbls>' +
    (chart.numFmt
      ? '<c:numFmt formatCode="' + escapeXml(chart.numFmt) + '" sourceLinked="0"/>'
      : '') +
    '<c:spPr><a:noFill/><a:ln><a:noFill/></a:ln></c:spPr>' +
    text(900, round ? 'FFFFFF' : '1F2A24', true) +
    (round ? '' : '<c:dLblPos val="' + (chart.stacked ? 'ctr' : 'outEnd') + '"/>') +
    '<c:showLegendKey val="0"/><c:showVal val="1"/><c:showCatName val="0"/><c:showSerName val="0"/><c:showPercent val="0"/><c:showBubbleSize val="0"/>' +
    (round ? '<c:showLeaderLines val="0"/>' : '') +
    '</c:dLbls>'
  );
}

function seriesXml(chart: Chart, series: ChartSeries, index: number) {
  const round = chart.kind === 'doughnut' || chart.kind === 'pie';
  const points = round
    ? (chart.pointColors ?? [])
        .map(
          (color, point) =>
            '<c:dPt><c:idx val="' +
            point +
            '"/><c:bubble3D val="0"/><c:spPr>' +
            solid(color) +
            '<a:ln w="19050">' +
            solid('FFFFFF') +
            '</a:ln></c:spPr></c:dPt>',
        )
        .join('')
    : '';

  return (
    '<c:ser><c:idx val="' +
    index +
    '"/><c:order val="' +
    index +
    '"/><c:tx><c:v>' +
    escapeXml(series.name) +
    '</c:v></c:tx>' +
    (series.color ? '<c:spPr>' + solid(series.color) + '</c:spPr>' : '') +
    (round ? '' : '<c:invertIfNegative val="0"/>') +
    points +
    labelsXml(chart) +
    categoriesXml(series) +
    valuesXml(series, chart.numFmt ?? 'General') +
    '</c:ser>'
  );
}

function axesXml(chart: Chart) {
  const horizontal = chart.kind === 'bar';
  const axisLine = '<c:spPr><a:ln w="9525">' + solid('D9D2BC') + '</a:ln></c:spPr>';
  return (
    '<c:catAx><c:axId val="10"/><c:scaling><c:orientation val="' +
    (horizontal ? 'maxMin' : 'minMax') +
    '"/></c:scaling><c:delete val="0"/><c:axPos val="' +
    (horizontal ? 'l' : 'b') +
    '"/><c:numFmt formatCode="General" sourceLinked="0"/><c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="nextTo"/>' +
    axisLine +
    text(900, '3D4A43') +
    '<c:crossAx val="20"/><c:crosses val="autoZero"/><c:auto val="1"/><c:lblAlgn val="ctr"/><c:lblOffset val="100"/><c:noMultiLvlLbl val="0"/></c:catAx>' +
    '<c:valAx><c:axId val="20"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="1"/><c:axPos val="' +
    (horizontal ? 't' : 'l') +
    '"/><c:majorGridlines><c:spPr><a:ln w="6350">' +
    solid('EFEADB') +
    '</a:ln></c:spPr></c:majorGridlines><c:numFmt formatCode="' +
    escapeXml(chart.numFmt ?? 'General') +
    '" sourceLinked="0"/><c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="nextTo"/><c:crossAx val="10"/><c:crosses val="' +
    (horizontal ? 'max' : 'autoZero') +
    '"/><c:crossBetween val="between"/></c:valAx>'
  );
}

function plotXml(chart: Chart) {
  const series = chart.series.map((item, index) => seriesXml(chart, item, index)).join('');

  if (chart.kind === 'doughnut') {
    return (
      '<c:doughnutChart><c:varyColors val="1"/>' +
      series +
      '<c:firstSliceAng val="0"/><c:holeSize val="58"/></c:doughnutChart>'
    );
  }
  if (chart.kind === 'pie') {
    return (
      '<c:pieChart><c:varyColors val="1"/>' + series + '<c:firstSliceAng val="0"/></c:pieChart>'
    );
  }
  return (
    '<c:barChart><c:barDir val="' +
    (chart.kind === 'bar' ? 'bar' : 'col') +
    '"/><c:grouping val="' +
    (chart.stacked ? 'stacked' : 'clustered') +
    '"/><c:varyColors val="0"/>' +
    series +
    '<c:gapWidth val="55"/>' +
    (chart.stacked ? '<c:overlap val="100"/>' : '<c:overlap val="-10"/>') +
    '<c:axId val="10"/><c:axId val="20"/></c:barChart>' +
    axesXml(chart)
  );
}

export function chartXml(chart: Chart) {
  const showLegend = chart.series.length > 1 || chart.kind === 'doughnut' || chart.kind === 'pie';
  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<c:chartSpace ' +
    NS +
    '><c:roundedCorners val="0"/><c:chart>' +
    titleXml(chart.title) +
    '<c:autoTitleDeleted val="0"/><c:plotArea><c:layout/>' +
    plotXml(chart) +
    '<c:spPr><a:noFill/></c:spPr></c:plotArea>' +
    (showLegend
      ? '<c:legend><c:legendPos val="' +
        (chart.series.length > 1 ? 'b' : 'r') +
        '"/><c:overlay val="0"/>' +
        text(900, '3D4A43') +
        '</c:legend>'
      : '') +
    '<c:plotVisOnly val="1"/><c:dispBlanksAs val="gap"/></c:chart>' +
    '<c:spPr>' +
    solid('FFFFFF') +
    '<a:ln w="9525">' +
    solid('E4DCC4') +
    '</a:ln></c:spPr>' +
    '<c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr><a:latin typeface="Calibri"/></a:defRPr></a:pPr><a:endParaRPr lang="es-CO"/></a:p></c:txPr>' +
    '</c:chartSpace>'
  );
}

export function drawingXml(charts: Chart[], relationIds: string[]) {
  const anchors = charts
    .map(
      (chart, index) =>
        '<xdr:twoCellAnchor editAs="oneCell"><xdr:from><xdr:col>' +
        chart.from[1] +
        '</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>' +
        chart.from[0] +
        '</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>' +
        chart.to[1] +
        '</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>' +
        chart.to[0] +
        '</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="' +
        (index + 2) +
        '" name="' +
        escapeXml(chart.title) +
        '"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/></xdr:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" r:id="' +
        relationIds[index] +
        '"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor>',
    )
    .join('');

  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    anchors +
    '</xdr:wsDr>'
  );
}
