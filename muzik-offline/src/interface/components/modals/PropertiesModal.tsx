type Props = {}

const PropertiesModal = (props: Props) => {

    function formatBytes(bytes: number, decimals: number = 0) {
        if (!+bytes) return '0 Bytes'
    
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    return (
        <div>PropertiesModal</div>
    )
}

export default PropertiesModal