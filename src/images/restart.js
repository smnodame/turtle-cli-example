import React from "react"

function Restart({ width, height, fill }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            version="1.1"
            viewBox="-0.018 0 393.98 461.351"
            xmlSpace="preserve"
        >
            <path
                fill={fill || "#333"}
                d="M176.841 8.504L85.19 100.153l91.648 91.646c11.34 11.34 29.728 11.343 41.067 0 11.342-11.34 11.342-29.729 0-41.068h.001L196.974 129.8l.032-59.327 20.902-20.9c11.342-11.34 11.342-29.727 0-41.068-11.34-11.34-29.726-11.34-41.067-.001z"
            ></path>
            <path
                fill={fill || "#333"}
                d="M385.528 207.657c-15.145-50.365-48.999-91.817-95.321-116.719-32.387-17.414-68.16-25.265-103.967-23.244l3.4 62.306c60.574-3.303 117.959 35.006 136.185 95.61 21.324 70.911-18.9 145.934-89.693 167.47-.391.099-.782.196-1.173.311-.513.15-1.028.288-1.543.433-.576.163-1.155.331-1.733.485-.348.094-.695.178-1.043.266-.771.2-1.544.4-2.317.585-.158.038-.319.072-.478.109-50.985 12.023-102.891-6.962-134.674-45.46-.307-.375-.611-.746-.913-1.122-.273-.339-.544-.677-.815-1.02-31.641-40.189-38.783-96.68-14.149-144.721.011-.022.021-.045.033-.066a132.182 132.182 0 011.621-3.061c8.249-15.11 2.688-34.048-12.423-42.297-15.11-8.251-34.048-2.689-42.297 12.421l-.001.001c-.219.4-.424.804-.638 1.205l-.04-.021C-1.354 217.449-6.729 270.696 8.417 321.062c15.146 50.365 48.998 91.817 95.32 116.722 46.323 24.904 99.569 30.277 149.936 15.13 50.365-15.146 91.817-48.997 116.72-95.318 24.908-46.325 30.281-99.575 15.135-149.939z"
            ></path>
        </svg>
    )
}

export default Restart