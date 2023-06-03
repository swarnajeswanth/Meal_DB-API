// Checking the URL to which it redirected and Loading the Required JS Script 
let href=window.location.href.split('/');
if(href[href.length-1]=='Home.html' || href[href.length-1]=='Home.html#' ){
        window.onload=function(){

            // Accquring the Required HTML Elements
                // Search Box HTML Element
            var search_Area=document.getElementById("search_area");
            
                // Suggestion container Elements 
            var suggestion_Area= document.querySelector(".suggestions");
            var suggestion_result= document.querySelector("#search_Result");
                
                //Favourite Container Elements 
            var Favourite;
            var favourite_Card=document.querySelector('#favourite_Card > i');
            var favourite_Container=document.querySelector(".favourite > .favourite_List");

            
                // Event Listener for Favourite Item xmark icon and remove item from local storage
            favourite_Container.addEventListener('click',(e)=>{
                let id= e.target.id.slice(1,e.target.id.length-1);
                if(e.target.classList[1]=="fa-xmark"){
                   localStorage.removeItem(id);
                   favourite_List_render();
                }
            })


            // fuction for redering the Favourite list on Window reload
            function favourite_List_render(){
                if(localStorage.length!=0){
                    // favourite_Container.setAttribute('style','display:none');
                    favourite_Container.innerHTML='';
                    for(i of Object.values(localStorage)){
                        favourite_Container.innerHTML+=`<div class="favourite_Item_Card">
                        <a href="./Meal_Detail_Page.html?id=\`${i}\`" onclick="meal_Details();">${i}</a>
                        <i id="\`${i}\`"class="fa fa-xmark"></i>
                        </div>
                        `;
                    }
                    
                }
            }

            // Adding items to Favourite List Event and Rendering List
            suggestion_result.addEventListener('click',(e)=>{
                if(Object.values(e.target.classList).includes('fa-heart')){
                    let heart=e.srcElement.offsetParent.lastElementChild;
                    if(heart.getAttribute('style')==null || heart.getAttribute('style')=="color:white"){
                            heart.setAttribute('style','color:red');
                            localStorage.setItem(e.srcElement.offsetParent.outerText,e.srcElement.offsetParent.outerText);
                    }
                    else{
                        heart.setAttribute('style','color:white');
                        localStorage.removeItem(e.srcElement.offsetParent.outerText);
                    }
                    favourite_Container.setAttribute('style','display:none');
                    if(favourite_Card.classList.value.includes("fa-minus")){
                        favourite_Card.classList.remove("fa-minus");
                        favourite_Card.classList.add("fa-plus");
                    }
                }
                favourite_List_render();
                
            });

  
            // Event Listener on Favourite Card for Updating font-awesom icon
            favourite_Card.addEventListener('click',()=>{
                if((favourite_Card.classList.value).includes("fa-plus")){
                    
                    favourite_Container.setAttribute('style','display:block');
                    favourite_Card.classList.remove("fa-plus");
                    favourite_Card.classList.add("fa-minus");
                }
                else{
                    favourite_Container.setAttribute('style','display:none');
                    favourite_Card.classList.remove("fa-minus");
                    favourite_Card.classList.add("fa-plus");
                }
            });





        // Functions for Fetching  Suggesitions data and adding it to suggestion container

                // Function to Fetch from Object and Add Elements to HTML
                function Display(value){
                    // let meal= value.meals.slice(0,25);
                    let meal=value.meals;
                    
                    // Updating the Suggestion container with Recieved Recipe from API
                    for(i in meal){
                       
                        suggestion_result.innerHTML+=`
                        <div class="Sugg_result" id=${meal[i].strMeal}>
                            <img src="${meal[i].strMealThumb}" alt="">
                            <a href="./Meal_Detail_Page.html?id=\`${meal[i].strMeal}\`"><p>${meal[i].strMeal}</p></a>
                            <i id="\`${meal[i].strMeal}\`"class="fa fa-duotone fa-heart"></i>
                        </div>`;
                        
                    };    
                    Favourite=document.querySelectorAll(".Sugg_result > i");

                    for(i of meal){
                        if(Object.values(localStorage).includes( i.strMeal)){
                                 for(j of Favourite){
                                     if(j.id.slice(1,j.id.length-1)==i.strMeal){
                                        j.setAttribute('style','color:red');
                                    }
                                 }
                        }
                    }
                };

                // Fetching the Food Recipe data from API
                function suggestions(){  
                    if(search_Area.value!=""){
                        let sugg_Fetch=`https://www.themealdb.com/api/json/v1/1/search.php?s=${search_Area.value}`;
                        fetch(sugg_Fetch).then((Response)=>{
                            Response.json().then((value)=>{
                                suggestion_result.innerHTML='';
                                Display(value);
                            }).catch(()=>{
                                suggestion_result.innerHTML="No Result Found";
                            });
                        });
                    }
                    suggestion_result.innerHTML="No Result Found";
                };

                // Event for Search bar and for Showing Suggestions 
                search_Area.addEventListener('keyup',suggestions) ;

        // On Focus on Search Bar , The suggestion container should be visible
        search_Area.addEventListener('focusin',()=>{
            suggestion_Area.setAttribute('style','display:block');
        });
        favourite_Container.setAttribute('style','display:none');
        favourite_List_render();
    }()
}
// Checking the URL to which it redirected and Loading the Required JS Script 
else if(href[href.length-1].split('?')[0]=="Meal_Detail_Page.html"){
    window.onload= function(){
        // Getting the Value sent through URL 
        let url_string=(window.location.href).toLowerCase();
        let url = new URL(url_string);
        let id = url.searchParams.get("id");
        let test =id.slice(1,id.length-1);
        let j=0;

        // Accquring the Elements requried
        var meal_Container=document.getElementById("meal_Container");
        var container_Img= document.querySelector(".container> img");
        var procedure=document.querySelector(".procedure>div");

        let T=[]; // This 2D List will contains Information about the meal with no Null values
        let ingredient_Names=[]; // List for storing the Ingredient Names
        let ingredient_Values=[]; // List for storing the Ingredient Values
       

        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${test}`).then((Response)=>{
                Response.json().then((value)=>{
                    meal_Details(value);
                }).catch(()=>{
                    alert("Error : Couldn't able to fetch the Recipe. Try Again .........!");
                    // Alert Message if any of the Recipe is not found
                    window.history.back();
                   
                });
            });
        
            function meal_Details(v){
                let meal= v.meals[0];
                let test=Object.entries(meal);

                // For Clearing null & '' & ' ' from the Meal Array
                for(i of test){
                    if(i[1]!=null &&  i[1]!='' && i[1]!=' '){
                        T.push(i);
                    }
                }
                // Getting the Ingredient_names & Values and storing into the list
                for(i of T){
                     if(i[0].match(/strIngredient\d/i)){
                        ingredient_Names.push(i);
                     }               
                }
                for(i of T){
                    if(i[0].match(/strMeasure\d/i)){
                       ingredient_Values.push(i);
                    }               
               }
                // Updating the Img src     
               container_Img.src=`${meal.strMealThumb}`;
                meal_Container.innerHTML=`
                    <h1 id="meal_Name">${meal.strMeal} &nbspIngredients</h1>
                    <div class="ingredients">
                        
                        
                    </div>
                `;
                let ingredients_List=document.querySelector(".ingredients");
                for(i in ingredient_Names){
                    ingredients_List.innerHTML+=`
                        <div class="ingredient_List">
                            <p>&nbsp${ingredient_Names[i][1]}</p>
                            <span class="ingr_value">${ingredient_Values[i][1]}</span>
                        </div>
                        `;
                }
                for (i of meal.strInstructions.split('.')){
                    if(i!='' && i.length>=4){
                        procedure.innerHTML+=`
                        <div>
                            <span class="steps">${j+1}.STEP</span>
                            <p class="para">${i}</p>
                        </div>
                        
                        `;
                    j++;
                    }
                }
            }
    }()
}
else{
    // Sciprt for Favourite Menu list page 
    window.onload=function(){
        let favourite=document.getElementById("favourite");

        // Fetching the List Items from local storage and displaying in HTML
        for(i of Object.keys(localStorage)){
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${i}`).then((response)=>{
                response.json().then((value)=>{
                    let meal=value.meals;
                    favourite.innerHTML+=`
                    <div class="Sugg_result" id=${meal[0].strMeal}>
                    <img src="${meal[0].strMealThumb}" alt="">
                    <a href="./Meal_Detail_Page.html?id=\`${meal[0].strMeal}\`"><p>${meal[0].strMeal}</p></a>
                    </div>`;
                })
            })
        }
    }()
}