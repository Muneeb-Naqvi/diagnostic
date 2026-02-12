<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-3xl rounded-2xl">
    
    <div className="flex gap-6">
      
      <img
        src={doctor.profileImage}
        className="w-32 h-32 rounded-xl object-cover"
      />

      <div>
        <h2 className="text-2xl font-bold text-[#020331]">
          Dr. {doctor.name}
        </h2>
        <p className="text-[#3B75FD] font-medium">
          {doctor.specialization}
        </p>

        <p className="text-sm text-slate-500 mt-2">
          {doctor.hospital}
        </p>

        <p className="text-sm mt-2">
          {doctor.experience} Years Experience
        </p>

        <div className="mt-3 flex gap-2">
          {doctor.qualifications.map((q) => (
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs">
              {q}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-6">
      <h3 className="font-semibold mb-2">About</h3>
      <p className="text-sm text-slate-600">{doctor.bio}</p>
    </div>

    <div className="mt-6">
      <h3 className="font-semibold mb-2">Available Slots</h3>
      {doctor.availableSlots.map((day) => (
        <div key={day.date}>
          <p className="font-medium">{day.date}</p>
          <div className="flex gap-2 mt-2">
            {day.slots.map((slot) => (
              <button className="px-3 py-1 border rounded-md text-sm hover:bg-blue-50">
                {slot}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>

    <Button className="w-full mt-6 bg-[#3B75FD]">
      Request Appointment
    </Button>
  </DialogContent>
</Dialog>
