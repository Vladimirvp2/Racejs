import React, {Component} from 'react';
import {NEEDLE_ANGLE_RANGE, NEEDLE_ZERO_ANGLE, MAX_SPEED} from './../logic/config';

/* Speedometer component. It has such props as speed, fuel, distance */
class Speedometer extends Component{
	constructor(props) {
		super(props);				
	}
	
	shouldComponentUpdate(nextProps, nextState){
		if(nextProps.speed == this.props.speed){
			return false;
		}
		
		return true;
	}	
	
	/* 
	 * Calculate the correct angle of the needle
	 * @return int angle	
	*/
	getAngle( speed ) {
		return  speed * NEEDLE_ANGLE_RANGE / MAX_SPEED + NEEDLE_ZERO_ANGLE;
	}	
		
	render(){
		// apply calculated angle depending on the current speed
		var needleStyle = {
			transform: `rotate(${this.getAngle(this.props.speed)}deg)`
		};	
		return(
			<div className="inline">
				
				<div className="meter-wrap">				
					<div className="inner-meter"><span style={needleStyle} className="needle"></span></div>
					<div className="fuel">FUEL: {this.props.fuel.toFixed(2)}L</div>
					<div className="distance">DIST: {this.props.distance.toFixed(2)}km</div>					
				</div>				
			</div>
		);
	}
}

export default Speedometer;

