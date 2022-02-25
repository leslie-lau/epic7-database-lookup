console.log("index.js");

main();

async function main(){

	let heroList = await getCharacterList()
		.then(res => res)
		.catch((error) => {
			console.error(error);
			return null;
		});

	displayCharacterListTabular(heroList);


	// Retrieves hero data from the hero endpoint
	async function getCharacterList(){
		const characterList = await fetch("https://api.epicsevendb.com/hero")
		.then(res => {
			if (!res.ok) throw new Error(res.status + " Failed to fetch data");
			return res.json();
		})
		.then(data => data.results)
		.catch((error) => {
			console.error(error);
			return false;
		});

		return characterList;
	}


	// Loop through the list of heroes heroList and add each character to the table
	function displayCharacterListTabular(heroList){
		if (heroList){
			for (let i = 0; i < heroList.length; i++){
				const heroId = heroList[i]._id
				const heroName = heroList[i].name
				addCharacterToTable(heroName, heroId);
			}
			return true;
		}
		else {
			addCharacterToTable("Hero Not Found", "N/A");
			return false;
		}
	} 


	// Create and add a row with the hero name and id to the table
	function addCharacterToTable(name, id){
		const tr = document.createElement("tr");
		const tdName = document.createElement("td");
		const tdId = document.createElement("td");
		tdName.innerHTML = name;
		tdId.innerHTML = id;
		tr.appendChild(tdName);
		tr.appendChild(tdId);
		document.getElementById("charTable").appendChild(tr);
	}

}

async function displayHeroData(){

	const heroId = getSearchHero();
	if (!heroId) {
		showLookupError();
		return false;
	}

	let heroData = await getHeroData(heroId)
		.then(res => res)
		.catch((error) => {
			console.error(error);
			return null;
		});

	displayHeroData(heroData);


	function getSearchHero(){
		const heroId = document.getElementById("searchInput").value;
		return heroId
	}


	function showLookupError(){
		const searchBar = document.getElementById("searchInput");
		searchBar.style.borderColor = "orange";
		document.getElementById("searchErrorIcon").style.visibility = "visible";
	}


	async function getHeroData(heroId){
		const heroData = await fetch("https://api.epicsevendb.com/hero/" + heroId)
			.then(res => {
				if (!res.ok) {
					throw new Error(res.status + " Failed to fetch data");
				}
				return res.json();
			})
			.then(data => data)
			.catch((error) => {
				console.error(error);
				return null;
			});

		return heroData;
	}

	function displayHeroData(heroData){
		const searchBar = document.getElementById("searchInput");
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

		showLookupError(searchBar);
		return false;
	}
}

