/* 
 * Speed ranges. In the GOOD range(50-60km/h) you get a point per sec.
 * In the HIGH range (>60km/h) you loose 5 points every 5 sec
*/
const SpeedRange = Object.freeze({
    LOW:   0,
    GOOD:  1,
    HIGH:  2,
});

export default SpeedRange;