import React, {Component} from 'react';

import Speedometer from './Speedometer';
import Tachometer from './Tachometer';
import GearIndicator from './GearIndicator';

import {NEEDLE_ANGLE_RANGE, NEEDLE_ZERO_ANGLE, MAX_SPEED} from './../logic/config';

/* Dashboard component containing speedometer, tachometer and gears indicator */
class Dashboard extends Component{
	constructor(props) {
		super(props);				
	}
		
	render(){
		// determine the class depending on whether the game has just started and ingition turned on/off
		let dashBoardClass = "";
		if ( this.props.gamestart ){
			dashBoardClass = "dashboard-container";
		}
		else if (this.props.ignition){
			dashBoardClass = "dashboard-container elementToFadeIn";
		}
		else{
			dashBoardClass = "dashboard-container elementToFadeOut";		
		}
		
		return(
			<div className={ dashBoardClass }>
				<Speedometer speed={this.props.speed} fuel={this.props.fuel} distance={this.props.distance} />
				<GearIndicator gear={this.props.gear} />
				<Tachometer rev={this.props.rev} />	
			</div>
		);
	}
}

export default Dashboard;