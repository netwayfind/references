async function main() {
    let config = await readConfig();
    let tagRefs = {};
    let refUrls = {};
    for (let i in config) {
        let entry = config[i];
        let ref = entry["name"];
        let tagsEntries = entry["tags"];
        if (isEmpty(tagsEntries)) {
            addRefToTag(tagRefs, ref, null);
        }
        else {
            for (let j in tagsEntries) {
                let tag = tagsEntries[j];
                addRefToTag(tagRefs, ref, tag);
            }
        }
        refUrls[ref] = entry["urls"];
    }

    let mainText = "<h1>references</h1>\n";
    Object.keys(tagRefs).sort().forEach(function(tag) {
        let refs = tagRefs[tag];
        mainText += "<details><summary><span class=\"tag\">" + tag + "</span> (" + refs.length + ")</summary><ul>";
        for (let i in refs) {
            let ref = refs[i];
            let urls = refUrls[ref];
            if (isEmpty(urls)) {
                mainText += "<li>" + ref + "</li>";
            }
            else {
                mainText += "<li>" + ref + "<ul>";
                for (let i in urls) {
                    let url = urls[i]
                    mainText += "<li><a href=\"" + url + "\" target=\"_blank\">" + url + "</a></li>";
                }
                mainText += "</ul></li>";
            }
        }
        mainText += "</ul></details>\n";
    });
    document.getElementById("menu").innerHTML = mainText;
}

function addRefToTag(tagRefs, ref, tag) {
    let refs = tagRefs[tag];
    if (refs === undefined) {
        refs = [];
        tagRefs[tag] = refs;
    }
    refs.push(ref);
}

function isEmpty(value) {
    if (value === undefined || value === null || value.length === 0) {
        return true;
    }
    return false;
}

async function readConfig() {
    let response = await fetch("config.json");
    return await response.json();
}

async function readUrl(url) {
    let response = await fetch(url);
    return await response.text();
}
