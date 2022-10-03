const apiServer = process.env.REACT_APP_API_URL;

export const getScanned = (scanned) => {
    return scanned?.map(scan => {
        const src = scan.scan_path.replace('uploads/dts/', apiServer + '/dts/')
        const local = scan.scan_path.replace(
            "uploads\\dts\\",
            "http://localhost:3001/dts/"
          );
        if(process.env.NODE_ENV === 'development')
        {
            return {src: local, thumbnail: local}
        }
        return {src: src, thumbnail: src}
    })
} 
export const getAttachments = (attachments) => {
    return attachments?.map(attach => {
        const src = attach.attach_path.replace('uploads/dts/', apiServer + '/dts/')
        const local = attach.attach_path.replace(
            "uploads\\dts\\",
            "http://localhost:3001/dts/"
          );
        if(process.env.NODE_ENV === 'development'){
            return {src: local, attach_name: attach.attach_name}
        }
        return {src: src, attach_name: attach.attach_name}
    })
} 