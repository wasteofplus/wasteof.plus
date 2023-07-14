function waitForElm(selector, callback, ignoreClasses) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            console.log("mutation", mutations)
            if (document.querySelector(selector)) {
                let elementsThatDidntHaveClass = false;
                for (const { addedNodes } of mutations) {
                    for (const node of addedNodes) {
                        if (!node.tagName) continue; // not an element
                        if (node.classList.contains('replyCount')||
                            node.classList.contains('actionDropdownItem')||
                            node.classList.contains('commentActionDropdown')||
                            node.classList.contains('readIndicator')||
                            node.classList.contains('replyIcon')||
                            node.classList.contains('dropdownIcon')) {
                            continue
                        } else {
                            elementsThatDidntHaveClass = true;
                        }
                    }
                }
                if (elementsThatDidntHaveClass) {
                    console.log("observer ended up!")
                    resolve(document.querySelector(selector));
                    if (callback) {
                        callback();
                    } else {
                        observer.disconnect();
                    }
                }

            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function observeUrlChange(onUrlChange) {
    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            console.log("url changed!");
            onUrlChange(true)
            observer.disconnect();
        }
    });
    observer.observe(body, { childList: true, subtree: true });
};

function generateSelector(elem) {

    var element = elem;
    var str = "";
  
    function loop(element) {
  
      // stop here = element has ID
      if(element.getAttribute("id")) {
        str = str.replace(/^/, " #" + element.getAttribute("id"));
        str = str.replace(/\s/, "");
        str = str.replace(/\s/g, " > ");
        return str;
      }
  
      // stop here = element is body
      if(document.body === element) {
        str = str.replace(/^/, " body");
        str = str.replace(/\s/, "");
        str = str.replace(/\s/g, " > ");
        return str;
      }
  
      // concat all classes in "queryselector" style
      if(element.getAttribute("class")) {
        var elemClasses = ".";
        elemClasses += element.getAttribute("class");
        elemClasses = elemClasses.replace(/\s/g, ".");
        elemClasses = elemClasses.replace(/^/g, " ");
        var newElemClasses = ".";
        for (const className in elemClasses.split(".")) {
            if (!(className.includes("dark"))) {
                newElemClasses += className;
            }
        }
        elemClasses = newElemClasses;
        var classNth = "";
  
        // check if element class is the unique child
        var childrens = element.parentNode.children;
  
        if(childrens.length < 2) {
          return;
        }
  
        var similarClasses = [];
  
        for(var i = 0; i < childrens.length; i++) {
          if(element.getAttribute("class") == 
  childrens[i].getAttribute("class")) {
            similarClasses.push(childrens[i]);
          }
        }
  
        if(similarClasses.length > 1) {
          for(var j = 0; j < similarClasses.length; j++) {
            if(element === similarClasses[j]) {
              j++;
              classNth = ":nth-of-type(" + j + ")";
              break;
            }
          }
        }
  
        str = str.replace(/^/, elemClasses + classNth);
  
      }
      else{
  
        // get nodeType
        var name = element.nodeName;
        name = name.toLowerCase();
        var nodeNth = "";
  
        var childrens = element.parentNode.children;
  
        if(childrens.length > 2) {
          var similarNodes = [];
  
          for(var i = 0; i < childrens.length; i++) {
            if(element.nodeName == childrens[i].nodeName) {
              similarNodes.push(childrens[i]);
            }
          }
  
          if(similarNodes.length > 1) {
            for(var j = 0; j < similarNodes.length; j++) {
              if(element === similarNodes[j]) {
                j++;
                nodeNth = ":nth-of-type(" + j + ")";
                break;
              }
            }
          }
  
        }
  
        str = str.replace(/^/, " " + name + nodeNth);
  
      }
  
      if(element.parentNode) {
        loop(element.parentNode);
      }
      else {
        str = str.replace(/\s/g, " > ");
        str = str.replace(/\s/, "");
        return str;
      }
  
    }
  
    loop(element);
  
    return str;
  
  
  }

  function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

export { waitForElm, observeUrlChange, generateSelector, timeDifference };
