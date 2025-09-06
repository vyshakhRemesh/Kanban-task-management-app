import { MouseSensor, TouchSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
export function useDndSensors(){ return useSensors( useSensor(MouseSensor,{activationConstraint:{distance:6}}), useSensor(TouchSensor,{activationConstraint:{delay:120,tolerance:6}}), useSensor(KeyboardSensor,{coordinateGetter:sortableKeyboardCoordinates}) ) }
