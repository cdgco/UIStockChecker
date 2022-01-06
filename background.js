function checkStock() {
    var html = '',
        node = document.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    const regex = /(?<=Tracking.track\('Product Viewed', {)(.*)(?=\))/s;
    const reg2 = /(?<=quantity: )(.*)(?=coupon)/s;
    var count = html.match(regex)[1].match(reg2)[0].split(",")[0];

    return count;
  }
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: checkStock
    },
    (injectionResults) => {
        var myCount = injectionResults[0].result;
        if (myCount >= 50) {
            myCount = '50+';
        }
        else {
            myCount = myCount.toString();
        }
        chrome.action.setBadgeText({
            text: myCount,
            tabId: tab.id
          });
      });
  });