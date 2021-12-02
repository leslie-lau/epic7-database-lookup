console.log("index.js");

var heroList;

getCharacterList();

async function getCharacterList(){
	heroList = await fetch("https://api.epicsevendb.com/hero")
	.then(res => {
		if (!res.ok) throw new Error(res.status + " Failed to fetch data");
		return res.json();
	})
	.then(data => data.results)
	.catch((error) => {
		console.error(error);
		return false;
	});
	
	if (heroList){
		for (let i = 0; i < heroList.length; i++){
			let heroId = heroList[i]._id
			let heroName = heroList[i].name

			displayCharacterListTabular(heroId, heroName);
			// displayCharacterList(heroId);
		}
	}
	else {
		displayCharacterListTabular("Hero not found", "N/A");
	}
}

function displayCharacterList(heroId){
	let li = document.createElement("LI")
	li.innerHTML = heroId;
	document.getElementById("charList").appendChild(li);
} 

function displayCharacterListTabular(heroId, heroName){
	let tr = document.createElement("tr");

	let tdName = document.createElement("td");
	let tdId = document.createElement("td");
	tdName.innerHTML = heroName;
	tdId.innerHTML = heroId;
	tr.appendChild(tdName);
	tr.appendChild(tdId);

	document.getElementById("charTable").appendChild(tr);
} 

async function getHero(){
	let searchBar = document.getElementById("searchInput");
	let heroId = searchBar.value;

	for (let i = 0; i < heroList.length; i++){
		if (heroList[i]._id == heroId){
			let heroData = await fetch("https://api.epicsevendb.com/hero/" + heroId)
				.then(res => {
					if (!res.ok) {
						throw new Error(res.status + " Failed to fetch data");
					}
					return res.json();
				})
				.then(data => data)
				.catch((error) => {
					console.error(error);
					return false;
				});

			if (heroData){
				console.log(heroData);
				searchBar.style.borderColor = "grey";
				document.getElementById("searchErrorIcon").style.visibility = "hidden";
				document.getElementById("heroDetails").innerHTML = heroData.results[0].name + " // " + heroData.results[0].rarity + " Star";
				document.getElementById("heroIcon").src = heroData.results[0].assets.icon;
				document.getElementById("heroDetailsExtra").innerHTML = "Attribute: " + heroData.results[0].attribute + 
					"<br> Class: " + heroData.results[0].role + 
					"<br> Lvl 60 Awakened Stats: " + JSON.stringify(heroData.results[0].calculatedStatus.lv60SixStarFullyAwakened);
				document.getElementById("heroStory").innerHTML = heroData.results[0].story;
				return true
			}
		}
	}
	searchBar.style.borderColor = "orange";
	document.getElementById("searchErrorIcon").style.visibility = "visible";
	return false
}
