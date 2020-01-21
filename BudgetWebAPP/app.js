/*global console*/
/* eslint no-console: "off" */

var budgeController = (function() {
    //Expense
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calculatePercentage = function(totalIncome) {
        if(totalIncome > 0 ){
            this.percentage = (this.value / totalIncome) * 100 
        }else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }
    
    //Income
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
        
    };
    
    var calcuTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            // Create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
            }
            
            // Creat new item based on 'inc' or 'exp' typ
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if ( type ==='inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push it into data structure
            data.allItems[type].push(newItem);
            
            return newItem;
        },
        
        deleteItem :function (type, id) {
            var ids, index;
            // id = 3
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
                calcuTotal(type);
                console.log(data);
            }
        },
        
        
        calculateBudget: function() {
            
            // Calculate total income and expenses
            calcuTotal('exp');
            calcuTotal('inc');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // Calculate the percentage of income that we spent
            data.percentage = Math.round((data.totals.exp / data.totals.inc) *100);
            
        },
        
        calculatePercentages: function() {
            /* a = 20
               b = 40
               c = 80
               income = 200
               a = 20/200 = 0.2
               */
            data.allItems.exp.forEach(function(current) {
                current.calculatePercentage(data.totals.inc);
            });
        },
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(current) {
                return Math.round(current.getPercentage());
            })
            return allPerc;
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },
        
        testing: function(){
            console.log(data);
     }   
    }
})();


var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn:'.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel:'.budget__title--month'
    };
    
    var formatNumber = function(num, type) {
        var numSplit, dec, int, sign, type;
            /* + or - before number 
            2310,4567 -> + 2,310.46*/
            
        num = Math.abs(num);
        num = num.toFixed(2);
            
        numSplit = num.split('.');
            
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        
        dec = numSplit[1];
             
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };
    
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type) {
            var html, newHTML, element;
            // Create HTML string with Placeholder text
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type ==='exp') { 
                element = DOMstrings.expenseContainer;
                
                html = '<div class="item clearfix" id="exp-%id%">                          <div class="item__description">%description%</div>                            <div class="right clearfix"><div class="item__value">%value%</div>           <div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>   </div></div></div>';
            }

            //Replace the placeholder text with some acutal data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace ('%description%', obj.description);
            newHTML = newHTML.replace ('%value%', formatNumber(obj.value, type));

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },
        
        clearFields: function(){
            var fields, fieldArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', '+ DOMstrings.inputValue);
            
            fieldArr = Array.prototype.slice.call(fields);
            fieldArr.forEach(function(currentValue, index, array) {
                currentValue.value = '';
            });
            fieldArr[0].focus();
        },
        
        deleteListItem: function (itemID) {
            
            var el = document.getElementById(itemID);
            el.parentNode.removeChild(el);
            
        },
        
        displayBudget: function(obj){
            var type;
            
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '----';
            }
         
        },
        
        displayPercentages: function(percentages){
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            var nodeListForEach = function(list, callback){
                for (var i = 0; i < list.length; i ++) {
                    callback(list[i], i);
                }  
            };
            
            nodeListForEach(fields, function(current, index){
                
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else{
                    current.textContent = '-----';
                }
            });
            
        },
        
        displayMonth: function() {
            var now, year, month;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(DOMstrings.dateLabel).textContent = months[mon] + ' ' + year;
        },


        getDOMStrigs: function(){
            return DOMstrings;
        }
    };
    
    
    
    
})();

var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function(){
        
        //Add items into UIcontroller and budgetcontroller
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
    
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
        }
    });
        //Delete items in budget controller and UI controller
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    

    
    var DOM = UICtrl.getDOMStrigs();
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getinput();
        console.log(input);
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            
            
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI controller
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear fields
            UICtrl.clearFields();

            // 5. Calculate and update budget (top part)
            updateBudget();
            
            // 6. Update percentages
            updatePercentages();
        }
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
    
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        console.log(itemID);
        
        if (itemID) {
            
            //inc-1 split ID to find the right item in data structure
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseFloat( splitID[1] );
            
            // 1. Delete the item from data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget (top part)
            updateBudget();
            
            // 4. Delete percentages
            updatePercentages();
        }
    }
    
    var updatePercentages = function() {
        
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read the percentage from the budget controller
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        console.log(percentages);
        UICtrl.displayPercentages(percentages);
    }
    
    var updateBudget = function(){
      
        // 1. calculate budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        // 3. Update UI (top part)
//        console.log(budget);
        UICtrl.displayBudget(budget);
    };
    
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                        budget: 0,
                        percentage: 0,
                        totalInc: 0,
                        totalExp: 0});
            setupEventListeners();
        }
    }
    
    
})(budgeController, UIController);


controller.init();