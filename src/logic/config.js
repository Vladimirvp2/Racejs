// render time in miliseconds
const UPDATE_TIME = 10;

// speedometer
// speedometer needle range in deg
const NEEDLE_ANGLE_RANGE = 290; 
// needle start position at 0
const NEEDLE_ZERO_ANGLE = -145;
const MAX_SPEED = 220;

// increase of speed every app update if up key is pressed. The higher this param, the quicker the car accelerates
const SPEED_ADD_EACH_UPDATE = 0.4;
// decrease of speed every app update if the down key is pressed. The higher this param, the quicker the car slows down
const SPEED_SUB_EACH_UPDATE = -0.4;
// decrease of speed every app update if no or onother(not up, down) key is pressed. The higher this param, the quicker the car slows down
const SPEED_CHANGE_EACH_UPDATE = -0.06;
// how quickely the speedometer decreases speed after turning off the ignition
const SPEED_IGNITION_OFF_DECREASE = 10;
// min speed with a gear > 0
const SPEED_MIN_GEAR_ON = 5;

// tachometer
const MAX_REVOLUTIONS = 8000;
// min revolutions when the engine is turned on
const MIN_REVOLUTIONS = 1000;
// how quickely the tachometer decreases revs after turning off the ignition
const REVOLUTIONS_IGNITION_OFF_DECREASE = 250;
// how quickely the tachometer reaches min revs(1000) after turning on the ignition
const REVOLUTIONS_IDLING_START = 50;
// needle range in deg
const NEEDLE_ANGLE_RANGE_TACH = 290;
// needle start position at 0 
const NEEDLE_ZERO_ANGLE_TACH = -145;

// gear indicator, correspondence between gear and max speed
const GEARS = [
			{gear: 0, maxspeed: 0},
			{gear: 1, maxspeed: 50},
			{gear: 2, maxspeed: 80},			
			{gear: 3, maxspeed: 120},
			{gear: 4, maxspeed: 160},
			{gear: 5, maxspeed: 220},				
	]

// time for current gear to switch, in milliseconds	
const GEAR_SWITCH_TIME = 1000;	

// fuel	
// amount of fuel at the start, in liters
const FUEL = 5;
// fuel consumption, liters per 100km
const FUEL_CONSUMPTION = 200;
// fuel consumption while idling. Liters in 1 hour
const FUEL_CONSUMPTION_IDLING = 2;

// good and bad zones to get or loose points
const SPEED_POINTS = {good : { minspeed : 50, maxspeed : 60, time: 1, points: 1  },
	bad : { minspeed : 60, maxspeed : MAX_SPEED, time: 2, points: -5 }
 }
 
export {NEEDLE_ANGLE_RANGE, NEEDLE_ZERO_ANGLE, MAX_SPEED, UPDATE_TIME,
		SPEED_ADD_EACH_UPDATE, SPEED_SUB_EACH_UPDATE, SPEED_CHANGE_EACH_UPDATE, SPEED_IGNITION_OFF_DECREASE, SPEED_MIN_GEAR_ON,
		GEARS, GEAR_SWITCH_TIME,
		FUEL, FUEL_CONSUMPTION, FUEL_CONSUMPTION_IDLING,
		SPEED_POINTS,
		MAX_REVOLUTIONS, MIN_REVOLUTIONS, REVOLUTIONS_IGNITION_OFF_DECREASE, REVOLUTIONS_IDLING_START,
		NEEDLE_ANGLE_RANGE_TACH, NEEDLE_ZERO_ANGLE_TACH
		};