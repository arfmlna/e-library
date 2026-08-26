import { id } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(date);
};

export const dateOnlyFormatted = (date) => {
    if (!date) return "-"; 
    
    const d = new Date(date)
    
    if (isNaN(d.getTime())) {
        return "-";
    }
    
    return d.toLocaleDateString('id-ID', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
    });
}

export const timeAgo = (dateString) => {
  return formatDistanceToNow(new Date(dateString), { 
    addSuffix: true, 
    locale: id 
  });
};

export const timeFormatted = (date) => {
    if (!date) return "-";

    const d = new Date(date)
    
    if (isNaN(d.getTime())) {
        return "-";
    }

    return d.toLocaleDateString('id-ID', {
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false,   
    });
}