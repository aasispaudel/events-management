"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { MdDelete } from "react-icons/md"

const Participants = ({ participants, removeParticipant }) => {
  const [hovering, setHovering] = useState(null)

  return (
    <div className="flex flex-wrap gap-x-2">
      {participants.map((participant, index) => (
        <motion.div
          key={`${participant}${index}`}
          className="flex bg-default items-center rounded-lg hover:cursor-pointer px-2 gap-x-2"
          whileHover={{ scale: 1.1 }}
          onMouseEnter={(event) => setHovering(`${participant}${index}`)}
          onMouseLeave={() => setHovering(null)}
        >
          <div className="bg-default px-1 py-1">{participant}</div>
          {hovering === `${participant}${index}` && (
            <div onClick={() => removeParticipant(index)}>
              <MdDelete color="#F31260" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default Participants
