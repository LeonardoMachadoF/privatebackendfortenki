export const getTimePast = (itemDate: Date) => {
    let now = new Date(Date.now());
    let newDate = new Date(itemDate);

    let wantOptions = {
        minutes: Math.floor(((now.getTime() - newDate.getTime()) / 1000 / 60)).toFixed(0),
        hours: Math.floor(((now.getTime() - newDate.getTime()) / 1000 / 60 / 60)).toFixed(0),
        days: Math.floor(((now.getTime() - newDate.getTime()) / 1000 / 60 / 60 / 24)).toFixed(0)
    }

    if (parseInt(wantOptions['minutes']) < 60) {
        return `Há ${wantOptions['minutes']} minutos`
    }
    if (parseInt(wantOptions['hours']) < 24) {
        return `Há ${wantOptions['hours']} ${parseInt(wantOptions['hours']) > 1 ? 'horas' : 'hora'}`
    }
    return `Há ${wantOptions['days']} ${parseInt(wantOptions['days']) > 1 ? 'dias' : 'dia'}`
}

