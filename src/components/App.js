import React, {Component} from 'react';
import Speedometer from './Speedometer';
import Tachometer from './Tachometer';
import GearIndicator from './GearIndicator';
import Dashboard from './Dashboard';
import Popup from './Popup';
import Keys from './../enums/Keys';
import Events from './../enums/Events';
import CarData from './../logic/CarData';
import {UPDATE_TIME, FUEL} from './../logic/config';

/* Main component of the application. It catches user key input, passes it to the
 * controller and renders the dashboard component passing there data from controller 
*/
class App extends Component{

	constructor(props) {
		super(props);
		// current pressed key 
		this.currKey = Keys.OTHER;	
		// controller with business logic					
		this.carData = new CarData();
		// shows if the game has just started
		this.gameStart = true;
		// shows whether to show the result dialog with statistics
		this.showResltDialog = false;
		// set callback function. The main purpose of it is to catch an event when fuel runs out
		this.carData.setEventCallback( this.eventCalback.bind(this) )
						
		// start main render loop of the application
		var timerId = setInterval(this.update.bind(this), UPDATE_TIME);	
		// final result displayed in the result modal window
		this.result = {
			distance: 0,
			points: 0,
			maxspeed: 0,
			avgspeed: 0		
		};
	}
	
	/* Main loop of the application */
	update() {	
		this.carData.update( this.currKey );
		// set default input		
		this.currKey = Keys.OTHER;	
		// rerender
		this.setState( { ...this.state} );		
	}	
	
	/* Gets user input (arrow keys) */
	getKeyboardInput(event){
		switch ( event.keyCode ) {
		  case Keys.UP:
			this.currKey = Keys.UP;			
			break;
		  case Keys.DOWN:
			this.currKey = Keys.DOWN;
			break;
		  case Keys.RIGHT:
			this.currKey = Keys.RIGHT;
			break;
		  case Keys.LEFT:
			this.currKey = Keys.LEFT;
			break;			
		  default:	  
			this.currKey = Keys.OTHER;
			break;
		}	
	}
	
	/* Callback function for reacting to possible events, 
	 * for example to the case when fuel runs out 
	*/
	eventCalback( type ){
		switch(type){
			case Events.FUEL_OUT: 
				// form the result data from controller
				this.result = {
					distance: this.carData.getParam("distance"),
					maxspeed: this.carData.getParam("maxspeed"),
					avgspeed: this.carData.getParam("avgspeed"),
					points: this.carData.getParam("points")						
				}
				// switch off the ignition and show the result dialog
				this.ignition ();
				this.showResultDialog( true );
				break;
			
			default:
				break;
		}
	}
	
	/* Show/hide the result modal window */ 
	showResultDialog( show ){
		this.showResltDialog = show;
	}
	
	/* Torn on/off the ignition */
	ignition (){
		// if there is no fuel, do not allow the engine to start
		if ( this.carData.getParam("fuel") == 0 && !this.carData.getParam("ignition") ){
			alert("You can't start the engine, there is no fuel in the tank!");
			return;
		}
		this.carData.setIgnition( !this.carData.getParam("ignition")  );
		this.gameStart = false;
	}
	
	componentDidMount(){
		document.addEventListener("keydown", this.getKeyboardInput.bind(this), false);
	}

	componentWillUnmount(){
		document.removeEventListener("keydown", this.getKeyboardInput.bind(this), false);
	}

	render(){
		// show prompt when the game has just started
		let prompt = "";
		if (this.gameStart) {
			prompt = <div className="prompt-text">Press Ignition to start the engine. Use &uarr; and &darr; buttons to controle the speed. By pressing 
				 &larr; and &rarr; buttons you can switch the gears. It takes 1 sec for a gear to switch </div>
		}
		// ignition button text 
		let ignitionText = this.carData.getParam("ignition") ? "Turn off" : "Ignition"; 
		return(
			<div className="center">	
				<div className="score">Score: { this.carData.getParam("points") }</div>
				<Dashboard gear={this.carData.getParam("gear")} speed={this.carData.getParam("speed")} rev={this.carData.getParam("rev")}
				  fuel={this.carData.getParam("fuel")} distance={this.carData.getParam("distance")} ignition={this.carData.getParam("ignition")}
				  gamestart={ this.gameStart }/>	

				<button className="button button-ignition" onClick={this.ignition.bind( this )}>{ ignitionText }</button>	
				<Popup show={ this.showResltDialog } 
					distance={ this.result.distance }
					maxspeed={ this.result.maxspeed }
					avgspeed={ this.result.avgspeed }
					points={ this.result.points }
					closeF={ this.showResultDialog.bind(this, false) }
				/>
				<br />
				{ prompt }	
			</div>
		);
	}
}

export default App;