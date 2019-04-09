import Keys from './../enums/Keys';
import Events from './../enums/Events';

import SpeedRange from './../enums/SpeedRange';

import {MAX_SPEED, 
		SPEED_ADD_EACH_UPDATE, SPEED_SUB_EACH_UPDATE, SPEED_CHANGE_EACH_UPDATE,	SPEED_IGNITION_OFF_DECREASE, SPEED_MIN_GEAR_ON,
		GEARS, GEAR_SWITCH_TIME,
		UPDATE_TIME,
		FUEL, FUEL_CONSUMPTION, FUEL_CONSUMPTION_IDLING,
		SPEED_POINTS,
		MAX_REVOLUTIONS, MIN_REVOLUTIONS, REVOLUTIONS_IGNITION_OFF_DECREASE, REVOLUTIONS_IDLING_START,
		} from './config';

/* 
 * Controller containing all calculations. Gets user input from App component, update(key).
 * To get current values use getParam(param) 
*/
class CarData{

	constructor() {
		// initial state
		this.state = {
			speed: 0,
			gear: 0, 
			rev: 0,
			fuel: FUEL,
			distance: 0,
			time: 0,
			points: 0,
			ignition: 0,
			maxspeed: 0,
			avgspeed: 0
		}
		// the current gear is being changed. It's used to block user input while current gear is in the preccess of switching
		this.gearIsChanging = false;
		// current speed range. There are 3: LOW, GOOD, HIGH
		this.currSpeedRange = SpeedRange.LOW;
		// used for timers which control getting the score in good and bad zones
		this.pointsTimerId = 0;	
		// callback function for events. Type of event should be passed there as s parameter
		this.eventCallback = undefined;
		// array containing called events. Each event should be called only once
		this.calledCallbacks = [];
	}
	
	/* Main loop method. Is called every game frame */
	update(key){
		// ignore update if the ignition is turned off
		if (!this.state.ignition){
			key = Keys.OTHER;
		}
		this._updateGear(key);
		this._updateDriveTime();	
		this._updateDistance();
		this._updatePoints();
		this._updateRevolutions(key);
		this._updateSpeed(key);		
		this._updateFuel();
	}
	
	/* 
	 * Getter of current properties(speed, distance, gear...)
	 * @return float|int 
	*/
	getParam(param){
		return this.state[param];
	}
	
	/*
	 * Switch on / of the ignition
	 * @param bool val 
	*/	
	setIgnition( val ){
		this.state.ignition = Boolean(val);
	}
	
	/*
	 * Set callback function that will be called if a particular event takes place
	 * @param function callback
	*/		
	setEventCallback( callback ){
		this.eventCallback = callback;
	}
	
	/*
	 * Calls and event if it hasn't been called yet
	 * @param Event type  
	*/
	_callEvent( type ){
		// call the given event if it hasn't been called yet
		if ( !( type in this.calledCallbacks ) ){
			this.calledCallbacks.push( type );
			this.eventCallback( type );			
		}
	}
	
	/* Update the engine revolutions */
	_updateRevolutions(key){
		// if ignition switched off decrease quickly the speed
		if (!this.state.ignition){
			if (this.state.rev > 0){
				this.state.rev += SPEED_SUB_EACH_UPDATE * REVOLUTIONS_IGNITION_OFF_DECREASE;
			}
			
			return;
		}		
		
		/* 
		 * Get max revolutions at the current speed and gear 
		 * @return int number of revolutions
		*/
		let __getMaxRevolutions = () => {
			for (let gearData of GEARS) {
				if ( gearData.gear == this.state.gear ){
					if ( gearData.gear != 0 ){
						return this.state.speed / gearData.maxspeed * MAX_REVOLUTIONS; 
					}
					else {
						return MAX_REVOLUTIONS;
					}
				}				
			}
			
			return MAX_REVOLUTIONS;
		}
		
		/* 
		 * Get max speed at the given gear  
		 * @return int number of revolutions
		*/
		let __getMaxSpeed = () => {
			for (let gearData of GEARS) {
				if ( gearData.gear == this.state.gear && gearData.gear != 0 ){
					return gearData.maxspeed; 
				}
				else {
					return GEARS[1].maxspeed;
				}				
			}
		}	
	
		// if accelaraton
		if ( key == Keys.UP && this.state.fuel > 0 ){
			if ( this.state.rev < __getMaxRevolutions() ){
				this.state.rev += ((SPEED_ADD_EACH_UPDATE / __getMaxSpeed() ) * (MAX_REVOLUTIONS - MIN_REVOLUTIONS));
			}
			else{
				this.state.rev += ((SPEED_SUB_EACH_UPDATE / 2  / __getMaxSpeed() ) * (MAX_REVOLUTIONS - MIN_REVOLUTIONS));
			}
		}
		// if deceleration
		else if ( key == Keys.DOWN ) {
			this.state.rev += ((SPEED_SUB_EACH_UPDATE  / __getMaxSpeed() ) * (MAX_REVOLUTIONS - MIN_REVOLUTIONS));
		}
		else{
			this.state.rev += ((SPEED_CHANGE_EACH_UPDATE / 2 / __getMaxSpeed() ) * (MAX_REVOLUTIONS - MIN_REVOLUTIONS));
		}
		
		// when engine starts, the needle should quickely point at 1
		if (  this.state.fuel > 0 && this.state.rev < MIN_REVOLUTIONS ){
			this.state.rev += ( SPEED_ADD_EACH_UPDATE * REVOLUTIONS_IDLING_START );
		}
		
		// limit the number of revs by 0
		if ( this.state.fuel == 0 && this.state.rev < 0 ){
			this.state.rev = 0;
		}
		
		// limit the revs from above
		if (  this.state.rev >= MAX_REVOLUTIONS ){
			this.state.rev = MAX_REVOLUTIONS;
		}		
		
	}
	
	/* Updates info about user score. User can get the score or loose it depending how fast he drives */
	_updatePoints(){
		/*
		 * Switch off the timer for add/sub points
		 * @param float speedInterval
		*/
		let __switchOffInterval = ( speedInterval ) => {
			if (this.currSpeedRange != speedInterval){
				if ( this.pointsTimerId ){
					clearInterval( this.pointsTimerId );
					this.pointsTimerId = undefined;
				}
			}
		}
		
		/*
		 * Switch on the timer for add/sub points
		 * @param int points
		 * Sparam float time the interval to add/sub given points
		*/				
		let __startInterval = ( points, time ) => {
			if ( !this.pointsTimerId )	{
				this.pointsTimerId = setInterval( () => {
						this.state.points += points;
						if ( this.state.points < 0 ) {
							this.state.points = 0;
						}
				}, time );
			}			
		}
	
		if ( this.state.speed < SPEED_POINTS.good.minspeed){
			// if we are entering the low range from another one
			__switchOffInterval( SpeedRange.LOW );
			this.currSpeedRange = SpeedRange.LOW;
		}
		else if (this.state.speed >= SPEED_POINTS.good.minspeed && this.state.speed <= SPEED_POINTS.good.maxspeed){
			// if we are entering the good range from another one
			__switchOffInterval( SpeedRange.GOOD );		
			this.currSpeedRange = SpeedRange.GOOD;
			__startInterval( SPEED_POINTS.good.points, SPEED_POINTS.good.time * 1000 );	
		}		
		else{
			// if we are entering the high range from another one
			__switchOffInterval( SpeedRange.HIGH );		
			this.currSpeedRange = SpeedRange.HIGH;	
			__startInterval( SPEED_POINTS.bad.points, SPEED_POINTS.bad.time * 1000 );					
		}
				
	}
	
	/* 
	 * Update current gear 
	 * @param Keys key
	*/
	_updateGear(key){
		// if ignition switched off set the current gear to 0
		if (!this.state.ignition){
			this.state.gear = 0;
			return;
		}
		// if a gear is being changed, ignore the key press
		if (this.gearIsChanging){
			return;
		}
		// proccess a gear change 
		if (key == Keys.RIGHT){
			this._switchGearUp();
		}
		else if (key == Keys.LEFT){
			this.__switchGearDown();
		}	
	}
	
	/* Switch the curent gear up 1 if possible */
	__switchGearUp(){
		// find max gear
		let gearsMax = GEARS.length-1;
		if (this.state.gear < gearsMax){
			this.state.gear += 1;
			this.gearIsChanging = true;
			setTimeout( () => {this.gearIsChanging = false}, GEAR_SWITCH_TIME );
		}
	}
	
	/* Switch the curent gear down by 1 if possible */	
	__switchGearDown(){
		if (this.state.gear > 0){
			this.state.gear -= 1;
			this.gearIsChanging = true;
			setTimeout( () => {this.gearIsChanging = false}, GEAR_SWITCH_TIME );
		}
	}	
	
	/* Update current time value, in hours */	
	_updateDriveTime(){		
		this.state.time += UPDATE_TIME / 1000 / 3600;
	}
	
	/* Update current distance value, in km */
	_updateDistance(){
		this.state.distance += ( this.state.speed / 3600 * UPDATE_TIME / 1000 );
	}

	/* Update current fuel level */
	_updateFuel(){
		// if ignition switched off do not consume the fuel
		if (!this.state.ignition || this.state.fuel == 0 ){
			return;
		}
		// idling (proportional to time and revs)
		if (this.state.gear == 0 && this.state.speed < 1 ) {
			this.state.fuel -= (( FUEL_CONSUMPTION_IDLING / 3600  * UPDATE_TIME / 1000 ) *   (this.state.rev / MAX_REVOLUTIONS) );
		}
		// usual moving state
		else{
			let coveredDist = ( this.state.speed / 3600  * UPDATE_TIME / 1000 );
			this.state.fuel -= ( FUEL_CONSUMPTION * coveredDist / 100 );		
		}
		// do not allow the fuel level to be less than 0
		if (this.state.fuel < 0){
			this.state.fuel = 0;
			this._callEvent( Events.FUEL_OUT );
		}
	}		
	
	/* Update current speed and calculate the max and average speed */
	_updateSpeed(key){
		/* 
		 * Determine whether current speed exeeds the speed limit for thr current gear.
		 * It can happen by switching from higher to lower gear
		*/
		let __speedExceedsGearLimit = () => {
			for (let gearData of GEARS) {
				if ( gearData.gear == this.state.gear && this.state.speed >= gearData.maxspeed ){
					return true;
				}			
			}

			return false;	
		}

		/* 
		 * Check and correct if the speed is less than allowed
		*/
		let __limitMinSpeed = () => {
			if (this.state.gear == 0){
				if (this.state.speed < 0){
					this.state.speed = 0;
				}
			}
			else{
				if ( this.state.speed < SPEED_MIN_GEAR_ON ){
					this.state.speed += SPEED_ADD_EACH_UPDATE;
				}			
			}
		}	

		// if ignition switched off decrease quickly the speed
		if (!this.state.ignition){
			if (this.state.speed > 0){
				this.state.speed += SPEED_SUB_EACH_UPDATE * SPEED_IGNITION_OFF_DECREASE;
			}
			
			return;
		}
		// acceleration, up key
		if ( key == Keys.UP && this.state.fuel > 0 ){
			if ( !__speedExceedsGearLimit() ){
				this.state.speed += SPEED_ADD_EACH_UPDATE;
			}
			else{
				this.state.speed += SPEED_CHANGE_EACH_UPDATE;
			}
		}
		// deceleration, down key
		else if (key == Keys.DOWN){
			this.state.speed += SPEED_SUB_EACH_UPDATE;
		}
		else {
			this.state.speed += SPEED_CHANGE_EACH_UPDATE;
		}
		
		// min speed exceeds check
		__limitMinSpeed();

		// update the max speed value
		if ( this.state.speed > this.state.maxspeed ){
			this.state.maxspeed = this.state.speed;
		}
		
		// update the average speed value
		this.state.avgspeed = (this.state.time > 0) ? this.state.distance / this.state.time : 0;
			
	}
}

export default CarData;