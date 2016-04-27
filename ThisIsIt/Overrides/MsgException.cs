using System;
using System.Runtime.Serialization;

namespace ThisIsIt.Overrides
{
    public class MsgException : Exception
    {
        public MsgException() : base()
        {
        }

        public MsgException(string msg) : base(msg)
        {
        }

        public MsgException(string msg, Exception innerException) : base(msg, innerException)
        {
        }

        public MsgException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}