/**
 * Created by synerzip on 11/03/16.
 */
export function toggelDrawer(){
    return {
        type:'TOGGLE_DRAWER'
    }
}

export function updateToggelDrawerOpenState(openstate){
    return {
        type:'TOGGLE_DRAWER_STATE_UPDATE',
        payload:{openState: openstate}
    }
}
