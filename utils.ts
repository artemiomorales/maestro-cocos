import { v2, Vec2 } from 'cc';

/*
* @ClampVectorValue
* 
* Restricts the sensitivity of swipe information
* 
* @param Vector2 swipe Swipe information from EasyTouch plugin
* @param float sensitivity Sensitivity for either OnSwipe or OnSwipeEnd
*/
export function ClampVectorValue(rawVector: Vec2, maxMin: number = 1)
{
    let clampedVector = v2(0, 0);
    clampedVector.x = ClampValue(rawVector.x, maxMin, maxMin * -1);
    clampedVector.y = ClampValue(rawVector.y, maxMin, maxMin * -1);

    return clampedVector;
}

export function ClampValue(value: number, max: number, min: number) {
  if(value > max) {
    return max;
  }

  if(value < min) {
    return min;
  }

  return value;
}

export function GetV2Sign(vector2: Vec2) {
  const vectorValue = vector2.x + vector2.y;
  if(vectorValue >= 0) {
      return 1;
  }

  return -1;
}

export function InvertV2Values(vector2: Vec2, axesToInvert: string[]) {
  for (let i = 0; i < axesToInvert.length; i++) {
      if(axesToInvert[i] == "x") {
        vector2.x *= -1;
      } else {
        vector2.y *= -1;
      }
  }
  return vector2;
}

// Raises a Vector3 to a power while retaining
// its original positive or negative values
export function ExponentiateV2(rawVector: Vec2, power: number)
{
    const xValue = ExponentiatePosNegValue(rawVector.x, power);
    const yValue = ExponentiatePosNegValue(rawVector.y, power);
    return v2(xValue, yValue);
}

// Raises a positive or negative value to a power while
// retaining its original positive or negative value
export function ExponentiatePosNegValue(rawValue: number, power: number)
{
    const sign = rawValue >= 0 ? 1 : -1;
    const distance = Math.abs(rawValue);
    let exponentVal = distance > 0 ? Math.pow(distance, power) : 0;
    return exponentVal *= sign;
}

export function GetVector2Direction(vectors: Vec2[], invertX: boolean = false, invertY: boolean = false)
{
    const vectorTotals = GetVector2Totals(vectors);
    
    if (Math.abs(vectorTotals.x) > Math.abs(vectorTotals.y)) {
        
        if (invertX) {
            vectorTotals.x *= -1;
        }

        return vectorTotals.x > 0 ? v2(1, 0) : v2(-1, 0);
    }
    
    if (invertY) {
        vectorTotals.y *= -1;
    }

    return vectorTotals.y > 0 ? v2(0, 1) : v2(0, -1);
}

export function GetVector2Totals(vectors: Vec2[])
{
    let totalXForce = 0;
    let totalYForce = 0;

    for (let z = 0; z < vectors.length; z++) {
        totalXForce += vectors[z].x;
        totalYForce += vectors[z].y;
    }
    
    return v2(totalXForce, totalYForce);
}